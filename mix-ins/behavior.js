'use strict';

module.exports = {

    /**
     * @memberOf Behavior.prototype
     * @param {number} c - grid column index.
     * @param {string[]} keys
     */
    toggleSort: function(c, keys) {
        var column = this.getActiveColumn(c);
        if (column) {
            column.toggleSort(keys);
        }
    },

    sortChanged: function(hiddenColumns){
        if (removeHiddenColumns(
                this.dataModel.sorts,
                hiddenColumns || this.getHiddenColumns()
        )) {
            this.reindex();
        }
    }

};

//Logic to moved to adapter layer outside of Hypergrid Core
function removeHiddenColumns(oldSorted, hiddenColumns){
    var dirty = false;
    oldSorted.forEach(function(i) {
        var j = 0,
            colIndex;
        while (j < hiddenColumns.length) {
            colIndex = hiddenColumns[j].index + 1; //hack to get around 0 index
            if (colIndex === i) {
                hiddenColumns[j].unSort();
                dirty = true;
                break;
            }
            j++;
        }
    });
    return dirty;
}
