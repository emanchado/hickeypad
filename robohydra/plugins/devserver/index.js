var heads                   = require("robohydra").heads,
    RoboHydraHeadFilter     = heads.RoboHydraHeadFilter,
    RoboHydraHeadFilesystem = heads.RoboHydraHeadFilesystem,

    path = require("path"),
    fs   = require("fs");

// AppCache's manifest is funny in the sense that the browser will
// download the manifest twice, and if the second version is any
// different, the cache won't be updated at all. Hence, we need a
// stable, but constantly updated mark, like the timestamp of the most
// recent edit.
// Still, with this hack, the page has to be reloaded TWICE to get the
// latest version.
function extractFilesFromManifest(manifestData) {
    var manifestText = manifestData.toString(),
        lines        = manifestText.split("\n"),
        paths        = ["index.html"];   // always there, implicit

    for (var i = 0, len = lines.length; i < len; i++) {
        if (/^(NETWORK|FALLBACK)/.test(lines[i])) {
            break;
        }
        if (/^(#|CACHE MANIFEST)/.test(lines[i])) {
            continue;
        }
        if (lines[i].length === 0) {
            continue;
        }

        paths.push(lines[i]);
    }

    return paths;
}

function mostRecentEdit(basePath, paths) {
    var lastEditDate = 0;

    paths.forEach(function(p) {
        var fullPath = path.join(basePath, p),
            statInfo = fs.statSync(fullPath),
            mtime = statInfo.mtime.getTime();

        if (mtime > lastEditDate) {
            lastEditDate = mtime;
        }
    });

    return lastEditDate;
}

exports.getBodyParts = function(conf) {
    var documentRoot = conf.documentroot || 'build';

    return {
        heads: [
            new RoboHydraHeadFilter({
                // detached: true,
                name: 'appache-disabler',
                path: '.*\.appcache',
                filter: function(body) {
                    var manifestFiles = extractFilesFromManifest(body),
                        message = "# Added by RoboHydra to disable" +
                            " AppCache: " + mostRecentEdit(documentRoot,
                                                           manifestFiles);

                    return body.toString().replace("CACHE MANIFEST",
                                                   "CACHE MANIFEST\n" + message);
                }
            }),

            new RoboHydraHeadFilesystem({
                mountPath: '/',
                documentRoot: documentRoot
            })
        ]
    };
};
