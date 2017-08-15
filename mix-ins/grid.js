'use strict';

module.exports = {

    /**
     * @memberOf Hypergrid#
     * @param event
     */
    toggleSort: function(event) {
        if (!this.abortEditing()) { return; }

        var behavior = this.behavior,
            self = this,
            c = event.detail.column,
            keys =  event.detail.keys;

        behavior.toggleSort(c, keys);

        setTimeout(function() {
            self.synchronizeScrollingBoundaries();
            behavior.autosizeAllColumns();
            self.repaint();
        }, 10);
    }

};
