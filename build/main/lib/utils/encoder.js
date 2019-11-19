"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sortObject(obj) {
    if (obj === null) {
        return null;
    }
    if (typeof obj !== "object") {
        return obj;
    }
    // arrays have typeof "object" in js!
    if (Array.isArray(obj)) {
        return obj.map(sortObject);
    }
    var sortedKeys = Object.keys(obj).sort();
    var result = {};
    sortedKeys.forEach(function (key) {
        result[key] = sortObject(obj[key]);
    });
    return result;
}
function marshalJSON(json) {
    return Buffer.from(JSON.stringify(sortObject(json)));
}
exports.marshalJSON = marshalJSON;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb2Rlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvdXRpbHMvZW5jb2Rlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLFNBQVMsVUFBVSxDQUFDLEdBQUc7SUFDckIsSUFBSSxHQUFHLEtBQUssSUFBSSxFQUFFO1FBQ2hCLE9BQU8sSUFBSSxDQUFBO0tBQ1o7SUFDRCxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsRUFBRTtRQUMzQixPQUFPLEdBQUcsQ0FBQTtLQUNYO0lBQ0QscUNBQXFDO0lBQ3JDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUN0QixPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUE7S0FDM0I7SUFDRCxJQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFBO0lBQzFDLElBQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQTtJQUNqQixVQUFVLENBQUMsT0FBTyxDQUFDLFVBQUEsR0FBRztRQUNwQixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO0lBQ3BDLENBQUMsQ0FBQyxDQUFBO0lBQ0YsT0FBTyxNQUFNLENBQUE7QUFDZixDQUFDO0FBRUQsU0FBZ0IsV0FBVyxDQUFDLElBQUk7SUFDOUIsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN0RCxDQUFDO0FBRkQsa0NBRUMifQ==