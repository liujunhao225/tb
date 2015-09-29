Ext.onReady(function() {
	var getShopOrderAbnormalCount = function(){
	     Ext.Ajax.request({
             url: '/oscar/shopOrder/getShopOrderAbnormalCount.do',
             params: {
             },
             success: function(response) {
                 var text = Ext.decode(response.responseText);
                 if (text.success == true) {
                	 var count = text.count;
                	 $('#shopOrderAbnormalCount').html(count);
                 } else {
                	 var count = text.count;
                 }
             },
             failure: function() {
            	 var count = text.count;
             }
         });
	};
	var getPurchaseAbnormalCount = function(){
	     Ext.Ajax.request({
            url: '/oscar/diff/getPurchaseAbnormalCount.do',
            params: {
            },
            success: function(response) {
                var text = Ext.decode(response.responseText);
                if (text.success == true) {
                	 var count = text.count;
                	 $('#purchaseAbnormalCount').html(count);
                } else {
                }
            },
            failure: function() {
            }
        });
	};
	var getStoreHouseAbnormalCount = function(){
	     Ext.Ajax.request({
           url: '/oscar/cwchange/getStoreHouseAbnormalCount.do',
           params: {
           },
           success: function(response) {
               var text = Ext.decode(response.responseText);
               if (text.success == true) {
            	   var count = text.count;
            	   $('#storeHouseAbnormalCount').html(count);
               } else {
               }
           },
           failure: function() {
           }
       });
	};
	getShopOrderAbnormalCount();
	getPurchaseAbnormalCount();
	getStoreHouseAbnormalCount();
});