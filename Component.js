/*
* @version 0.1
* @author  connecttobn
* @created 2017-11-16
*/
sap.ui.define(['sap/ui/core/UIComponent'],
	function(UIComponent) {
	'use strict';

	var Component = UIComponent.extend('connecttobn.Component', {
		metadata : {
			rootView : 'connecttobn.home',
			dependencies : {
				libs : [
					'sap.tnt',
					'sap.m'
				]
			},
			config : {
				sample : {
					stretch : true,
					files : [
						'home.view.xml',
						"home.controller.js"
					]
				}
			}
		}
	});

	return Component;

});
