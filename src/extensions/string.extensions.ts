interface String {
    uglify(): string;
}

String.prototype.uglify = function () {
    //?
    return this.toLowerCase().trim().split(' ').join('-');
}