'use strict';

var directiveModule = angular.module('angular-dropdown-multiselect', []);

directiveModule.directive('ngDropdownMultiselect', ['$filter', '$document',
    '$compile', '$parse',
    function ($filter, $document, $compile, $parse) {

  return {
    restrict: 'AE',
    scope: {
      selectedModel: '=',
      options: '=',
      extraSettings: '=',
      events: '=',
      searchFilter: '=?',
      translationTexts: '=',
      groupBy: '@',
      ngDisabled: '='
    },
    templateUrl: 'src/partials/dropdown-multiselect.html',
    link: function ($scope, $element, $attrs) {

      var isModelEmpty = function() {
        return numberOfSelectedItem() === 0;
      };


      var getItemDisplayText = function(optionItem) {
        var displayText = optionItem[$scope.settings.displayProp];
        var converterResponse = $scope.settings.smartButtonTextConverter(displayText, optionItem);
        return converterResponse || displayText;
      };


      var numberOfSelectedItem = function() {
        var totalSelected;
        if ($scope.singleSelection) {
          totalSelected = ($scope.selectedModel !== null && angular.isDefined($scope.selectedModel[$scope.settings.idProp])) ? 1 : 0;
        } else {
          totalSelected = angular.isDefined($scope.selectedModel) ? $scope.selectedModel.length : 0;
        }
        return totalSelected;
      };


      var getSmartButtonTitle = function() {
        var itemsText = [];
        angular.forEach($scope.options, function (optionItem) {
          if ($scope.isChecked(optionItem[$scope.settings.idProp])) {
            itemsText.push(getItemDisplayText(optionItem));
          }
        });
        if (numberOfSelectedItem() > $scope.settings.smartButtonMaxItems) {
          itemsText = itemsText.slice(0, $scope.settings.smartButtonMaxItems);
          itemsText.push('...');
        }
        return itemsText.join(', ');
      };


      var getDefaultButtonTitle = function() {
        var totalSelected = numberOfSelectedItem();
        var titlePieces = [totalSelected, $scope.texts.dynamicButtonTextSuffix];
        if (totalSelected === 0) {
          titlePieces = [$scope.texts.buttonDefaultText];
        }
        return titlePieces.join(' ');
      };


      var getFindObj = function(id) {
        var findObj = {};
        findObj[$scope.settings.idProp] = id;
        return findObj;
      };


      var find = function(collection, queryObj) {
        if (angular.isArray(collection)) {
          for (var i = 0; i < collection.length; i++) {
            if (collection[i][$scope.settings.idProp] == queryObj[$scope.settings.idProp]) {
              return collection[i];
            }
          }
          return null;
        } else {
          if ($scope.selectedModel[$scope.settings.idProp] == queryObj[$scope.settings.idProp]) {
            return angular.copy($scope.selectedModel);
          }
        }
      };


      var findIndex = function(collection, queryObj) {
        if (angular.isArray(collection)) {
          for (var i = 0; i < collection.length; i++) {
            if (collection[i][$scope.settings.idProp] == queryObj[$scope.settings.idProp]) {
              return i;
            }
          }
        }
        return -1;
      };


      var getFinalObj = function(id) {
        var findObj = getFindObj(id);
        var finalObj = find($scope.options, findObj);
        return angular.copy(finalObj);
      };


      var objExists = function(id) {
        var findObj = getFindObj(id);
        var exists = false;
        if ($scope.singleSelection) {
          exists = $scope.selectedModel[$scope.settings.idProp] == id;
        } else {
          exists = findIndex($scope.selectedModel, findObj) !== -1;
        }
        return exists;
      };


      var isSelectionLimitExceeded = function() {
        return $scope.settings.selectionLimit > 0 &&
          numberOfSelectedItem() >= $scope.settings.selectionLimit;
      };


      var closeOnBlur = function(e) {
        var target = e.target.parentElement;
        var parentFound = false;
        while (angular.isDefined(target) && target !== null && !parentFound) {
          if (target.className.indexOf('multiselect-parent') != -1 && !parentFound) {
            if (target === $scope.$dropdownTrigger) {
              parentFound = true;
            }
          }
          target = target.parentElement;
        }
        if (!parentFound) {
          $scope.$apply(function () {
            $scope.open = false;
          });
        }
      };


      $scope.toggleDropdown = function () {
        $scope.open = !$scope.open;
      };


      $scope.checkboxClick = function ($event, id) {
        $scope.toggleItem(id);
        $event.stopImmediatePropagation();
      };


      $scope.getGroupTitle = function (groupValue) {
        if ($scope.settings.groupByTextProvider !== null) {
          return $scope.settings.groupByTextProvider(groupValue);
        }
        return groupValue;
      };


      $scope.getButtonText = function () {
        var title = '';
        if ($scope.settings.dynamicTitle && !isModelEmpty()) {
          if ($scope.settings.smartButtonMaxItems > 0) {
            title = getSmartButtonTitle();
          } else {
            title = getDefaultButtonTitle();
          }
        } else {
          title = $scope.texts.buttonDefaultText;
        }
        return title;
      };


      $scope.selectAll = function () {
        $scope.deselectAll({sendEvent: false});

        angular.forEach($scope.options, function (value) {
          $scope.selectItem(value[$scope.settings.idProp], {sendEvent: false});
        });

        $scope.externalEvents.onSelectAll();
      };


      $scope.deselectAll = function (params) {
        params = params || {};
        if (angular.isUndefined(params.sendEvent)) {
          params.sendEvent = true;
        }

        if ($scope.singleSelection) {
          $scope.selectedModel = {};
        } else {
          $scope.selectedModel.splice(0, numberOfSelectedItem());
        }

        if (params.sendEvent) {
          $scope.externalEvents.onDeselectAll();
        }
      };


      $scope.selectItem = function(id, params) {
        var params = params || {};
        if (angular.isUndefined(params.sendEvent)) {
          params.sendEvent = true;
        }
        var finalObj = getFinalObj(id);
        var sendEvent = function(item) {
          if (params.sendEvent) {
            $scope.externalEvents.onItemSelect(item);
          }
        };
        if ($scope.singleSelection) {
          $scope.selectedModel = finalObj;
          sendEvent(finalObj);
        } else if (!objExists(id) && !isSelectionLimitExceeded()) {
          $scope.selectedModel.push(finalObj);
          sendEvent(finalObj);
        }
      };


      $scope.deselectItem = function(id) {
        var finalObj = getFinalObj(id);
        if ($scope.singleSelection) {
          $scope.selectedModel = {};
        } else {
          $scope.selectedModel.splice(findIndex($scope.selectedModel, finalObj), 1);
        }
        $scope.externalEvents.onItemDeselect(finalObj);
      };


      $scope.toggleItem = function(id) {
        objExists(id) ? $scope.deselectItem(id) : $scope.selectItem(id);
      };


      $scope.isChecked = function (id) {
        if ($scope.singleSelection) {
          return $scope.selectedModel !== null &&
            angular.isDefined($scope.selectedModel[$scope.settings.idProp]) &&
            $scope.selectedModel[$scope.settings.idProp] === id;
        }
        return objExists(id);
      };


      (function constructor() {
        $scope.$dropdownTrigger = $element.children()[0];

        $scope.externalEvents = {
          onItemSelect: angular.noop,
          onItemDeselect: angular.noop,
          onSelectAll: angular.noop,
          onDeselectAll: angular.noop,
          onInitDone: angular.noop,
          onMaxSelectionReached: angular.noop
        };

        $scope.settings = {
          useFontAwesome: false,
          dynamicTitle: true,
          scrollable: false,
          scrollableHeight: '300px',
          closeOnBlur: true,
          displayProp: 'label',
          idProp: 'id',
          enableSearch: false,
          selectionLimit: 0,
          showCheckAll: true,
          showUncheckAll: true,
          closeOnSelect: false,
          buttonClasses: 'btn btn-default',
          closeOnDeselect: false,
          checkboxes: $attrs.checkboxes || undefined,
          groupBy: $attrs.groupBy || undefined,
          groupByTextProvider: null,
          smartButtonMaxItems: 0,
          smartButtonTextConverter: angular.noop
        };

        $scope.texts = {
          checkAll: 'Check All',
          uncheckAll: 'Uncheck All',
          selectionCount: 'checked',
          selectionOf: '/',
          searchPlaceholder: 'Search...',
          buttonDefaultText: 'Select',
          dynamicButtonTextSuffix: 'checked'
        };

        $scope.searchFilter = $scope.searchFilter || '';

        if (angular.isDefined($scope.settings.groupBy)) {
          $scope.$watch('options', function (newValue) {
            if (angular.isDefined(newValue)) {
              $scope.orderedItems = $filter('orderBy')(newValue, $scope.settings.groupBy);
            }
          });
        }

        angular.extend($scope.settings, $scope.extraSettings || []);
        angular.extend($scope.externalEvents, $scope.events || []);
        angular.extend($scope.texts, $scope.translationTexts);

        $scope.singleSelection = $scope.settings.selectionLimit === 1;

        $scope.style = {};
        $scope.style.check = $scope.settings.useFontAwesome ? 'fa fa-check' : 'glyphicon glyphicon-ok';
        $scope.style.remove = $scope.settings.useFontAwesome ? 'fa fa-cross' : 'glyphicon glyphicon-remove';

        if ($scope.singleSelection) {
          if (angular.isArray($scope.selectedModel) && $scope.selectedModel.length === 0) {
            $scope.selectedModel = {};
          }
        }

        if ($scope.settings.closeOnBlur) {
          $document.on('click', closeOnBlur);
          $scope.$on('$destroy', function() {
            $document.off('click', closeOnBlur)
          });
        }

        $scope.externalEvents.onInitDone();
      })();

    }
  };
}]);
