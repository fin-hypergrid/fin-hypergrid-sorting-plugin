'use strict';

module.exports = {

    get sorts() {
        if (!this._sorts) {
            this._sorts = [];
            this.dataSource.publish('set-sorts', this._sorts);
        }
        return this._sorts;
    },

    /**
     * @memberOf dataModels.JSON.prototype
     * @param column
     * @param keys
     */
    toggleSort: function(column, keys) {
        this.incrementSortState(column, keys);
        this.serializeSortState();
        this.reindex();
    },
    /**
     * @memberOf dataModels.JSON.prototype
     * @param column
     * @param {boolean} deferred
     */
    unSortColumn: function(column, deferred) {
        var sortSpec = this.getColumnSortState(column.index);

        if (sortSpec) {
            this.sorts.splice(sortSpec.rank, 1); //Removed from sorts
            if (!deferred) {
                this.reindex();
            }
        }

        this.serializeSortState();
    },

    /**
     * @param {number} columnIndex
     * @returns {sortSpecInterface}
     */
    getColumnSortState: function(columnIndex){
        var rank,
            sort = this.sorts.find(function(sort, index) {
                rank = index;
                return sort.columnIndex === columnIndex;
            });

        return sort && { sort: sort, rank: rank };
    },

    /**
     * @memberOf dataModels.JSON.prototype
     * @param column
     * @param {string[]} keys
     * @return {object[]} sorts
     */
    incrementSortState: function(column, keys) {
        var sorts = this.sorts,
            columnIndex = column.index,
            columnSchema = this.schema[columnIndex],
            sortSpec = this.getColumnSortState(columnIndex);

        if (!sortSpec) { // was unsorted
            if (keys.indexOf('CTRL') < 0) {
                sorts.length = 0;
            }
            if (sorts.length < this.grid.properties.maxSortColumns) {
                sorts.unshift({
                    columnIndex: columnIndex, // so define and...
                    direction: 1, // ...make ascending
                    type: columnSchema.type
                });
            }
        } else if (sortSpec.sort.direction > 0) { // was ascending
            sortSpec.sort.direction = -1; // so make descending
        } else { // was descending
            this.unSortColumn(column, true); // so make unsorted
        }
    },

    serializeSortState: function(){
        this.grid.properties.sorts = this.sorts;
    },

    /**
     * @memberOf dataModels.JSON.prototype
     * @param index
     * @param returnAsString
     * @desc Provides the unicode character used to denote visually if a column is a sorted state
     * @returns {*}
     */
    getSortImageForColumn: function(columnIndex) {
        var sorts = this.sorts,
            sortSpec = this.getColumnSortState(columnIndex),
            result, rank;

        if (sortSpec) {
            var directionKey = sortSpec.sort.direction > 0 ? 'ASC' : 'DESC',
                arrow = this.charMap[directionKey];

            result = arrow + ' ';

            if (sorts.length > 1) {
                rank = sorts.length - sortSpec.rank;
                result = rank + result;
            }
        }

        return result;
    }
};
