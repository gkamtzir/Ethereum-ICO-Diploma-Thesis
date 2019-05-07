DotSeparatorFilter.$inject = ["$filter"];
export function DotSeparatorFilter($filter: ng.IFilterService) {
    return (input) => {

        if (!(input != null))
            input = ""

        input = input.toString();
        if (input.length < 4) return input;

        let separator = ".";

        let tempInput = input.split("").reverse().join("");
        var offset = 0
        for (var i = 3; i < input.length; i += 3) {
            tempInput = [tempInput.slice(0, i + offset), separator, tempInput.slice(i + offset)].join("");
            offset += 1;
        }

        return tempInput.split("").reverse().join("");
    }
}