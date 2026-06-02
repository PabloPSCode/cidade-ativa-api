"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
class Log {
    id;
    userId;
    userName;
    email;
    activityDescription;
    createdAt;
    constructor(id, userId, userName, email, activityDescription, createdAt) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.email = email;
        this.activityDescription = activityDescription;
        this.createdAt = createdAt;
    }
    changeUserId(userId) {
        if (!userId.trim()) {
            throw new Error('userId is required');
        }
        this.userId = userId;
    }
    changeUserName(userName) {
        if (!userName.trim()) {
            throw new Error('userName is required');
        }
        this.userName = userName;
    }
    changeEmail(email) {
        if (!email.includes('@')) {
            throw new Error('Invalid email');
        }
        this.email = email;
    }
    changeActivityDescription(activityDescription) {
        if (!activityDescription.trim()) {
            throw new Error('activityDescription is required');
        }
        this.activityDescription = activityDescription;
    }
}
exports.Log = Log;
//# sourceMappingURL=Log.js.map