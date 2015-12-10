// Represents a configuration, i.e. all motors, all models, ...
function Items() {
    var allItems = [];
    var allPricesOrSrc = [];

    // Adds a single item
    function publicAddItem(item, price) {
        allItems.push(item);
        allPricesOrSrc.push(price);
    }

    // Returns all items
    function publicGetAllItems() {
        return allItems;
    }
    
    // Get the price or source for the given item
    function publicgetPriceOrSrc(item) {
        for (var i = 0; i < allItems.length; i++) {
            if (item == allItems[i].replace(new RegExp(" ", "g"), ""))
                return allPricesOrSrc[i];
        }
        
        return 0;
    }

    return {
        addItem: publicAddItem,
        getItems: publicGetAllItems,
        getPriceOrSrc: publicgetPriceOrSrc
    };

}