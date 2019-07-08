"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var os_1 = require("os");
var rxjs_1 = require("rxjs");
var child_process_1 = require("child_process");
var taskRegistered = false;
function addUpdateTask(pkg, to) {
    return function (host, context) {
        // Workflow should always be there during ng update but not during tests.
        if (!context.engine.workflow) {
            return;
        }
        if (!taskRegistered) {
            var engineHost = context.engine.workflow._engineHost;
            engineHost.registerTaskExecutor(createRunUpdateTask());
            taskRegistered = true;
        }
        context.engine._taskSchedulers.forEach(function (scheduler) {
            if (scheduler._queue.peek() &&
                scheduler._queue.peek().configuration.name === 'RunUpdate' &&
                scheduler._queue.peek().configuration.options.package === pkg) {
                scheduler._queue.pop();
            }
        });
        context.addTask(new RunUpdateTask(pkg, to));
    };
}
exports.addUpdateTask = addUpdateTask;
var RunUpdateTask = /** @class */ (function () {
    function RunUpdateTask(_pkg, _to) {
        this._pkg = _pkg;
        this._to = _to;
    }
    RunUpdateTask.prototype.toConfiguration = function () {
        return {
            name: 'RunUpdate',
            options: {
                package: this._pkg,
                to: this._to
            }
        };
    };
    return RunUpdateTask;
}());
function createRunUpdateTask() {
    return {
        name: 'RunUpdate',
        create: function () {
            return Promise.resolve(function (options, context) {
                context.logger.info("Updating " + options.package + " to " + options.to);
                var spawnOptions = {
                    stdio: [process.stdin, process.stdout, process.stderr],
                    shell: true
                };
                var ng = os_1.platform() === 'win32'
                    ? '.\\node_modules\\.bin\\ng'
                    : './node_modules/.bin/ng';
                var args = [
                    'update',
                    options.package + "@" + options.to,
                    '--force',
                    '--allow-dirty'
                ].filter(function (e) { return !!e; });
                return new rxjs_1.Observable(function (obs) {
                    child_process_1.spawn(ng, args, spawnOptions).on('close', function (code) {
                        if (code === 0) {
                            obs.next();
                            obs.complete();
                        }
                        else {
                            var message = options.package + " migration failed, see above.";
                            obs.error(new Error(message));
                        }
                    });
                });
            });
        }
    };
}
