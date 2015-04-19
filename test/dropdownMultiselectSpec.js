var $compile, $rootScope;

beforeEach(module('templates'));
beforeEach(module('angular-dropdown-multiselect'));

beforeEach(inject(function(_$compile_, _$rootScope_){
  $compile = _$compile_;
  $rootScope = _$rootScope_;
}));


describe('button text', function() {
  it('should display default text', function() {
    element = $compile('<div ng-dropdown-multiselect=""></div>')($rootScope);
    $rootScope.$digest();
    scope = element.isolateScope();
    expect(scope.getButtonText()).toBe(scope.texts.buttonDefaultText);
  });

  it('should display new default text value', function() {
    var scope = $rootScope.$new();
    scope.texts = {buttonDefaultText: 'New default value'};
    element = $compile('<div ng-dropdown-multiselect="" translation-texts="texts"></div>')(scope);
    $rootScope.$digest();
    var isolated = element.isolateScope();
    expect(isolated.getButtonText()).toBe('New default value');
  });

  it('should display how many items are checked', function() {
    var scope = $rootScope.$new();
    scope.model = [];
    scope.options = [{id: 'id1', label: 'label1'}, {id: 'id2', label: 'label2'}, {id: 'id3', label: 'label3'}];
    element = $compile('<div ng-dropdown-multiselect="" options="options" selected-model="model"></div>')(scope);
    $rootScope.$digest();
    var isolated = element.isolateScope();

    isolated.selectItem('id1');

    var expected = '1 ' + isolated.texts.dynamicButtonTextSuffix;
    expect(isolated.getButtonText()).toBe(expected);
  });

  it('should display how many items are checked (many)', function() {
    var scope = $rootScope.$new();
    scope.model = [];
    scope.options = [{id: 'id1', label: 'label1'}, {id: 'id2', label: 'label2'}, {id: 'id3', label: 'label3'}];
    element = $compile('<div ng-dropdown-multiselect="" options="options" selected-model="model"></div>')(scope);
    $rootScope.$digest();
    var isolated = element.isolateScope();

    isolated.selectItem('id1');
    isolated.selectItem('id2');

    var expected = '2 ' + isolated.texts.dynamicButtonTextSuffix;
    expect(isolated.getButtonText()).toBe(expected);
  });
});


describe('selectItem', function() {
  it('Should select one item', function() {
    var scope = $rootScope.$new();
    scope.model = [];
    scope.options = [{id: 'id1', label: 'label1'}, {id: 'id2', label: 'label2'}, {id: 'id3', label: 'label3'}];
    element = $compile('<div ng-dropdown-multiselect="" options="options" selected-model="model"></div>')(scope);
    $rootScope.$digest();
    var isolated = element.isolateScope();

    isolated.selectItem('id1');

    expect(scope.model.length).toBe(1);
  });

  it('Should select many items', function() {
    var scope = $rootScope.$new();
    scope.model = [];
    scope.options = [{id: 'id1', label: 'label1'}, {id: 'id2', label: 'label2'}, {id: 'id3', label: 'label3'}];
    element = $compile('<div ng-dropdown-multiselect="" options="options" selected-model="model"></div>')(scope);
    $rootScope.$digest();
    var isolated = element.isolateScope();

    isolated.selectItem('id1');
    isolated.selectItem('id2');

    expect(scope.model.length).toBe(2);
  });

  it('Should not change anything if we select twice the same item', function() {
    var scope = $rootScope.$new();
    scope.model = [];
    scope.options = [{id: 'id1', label: 'label1'}, {id: 'id2', label: 'label2'}, {id: 'id3', label: 'label3'}];
    element = $compile('<div ng-dropdown-multiselect="" options="options" selected-model="model"></div>')(scope);
    $rootScope.$digest();
    var isolated = element.isolateScope();

    isolated.selectItem('id1');
    isolated.selectItem('id1');

    expect(scope.model.length).toBe(1);
  });

  it('Should put the selected item in model', function() {
    var scope = $rootScope.$new();
    scope.model = [];
    scope.options = [{id: 'id1', label: 'label1'}, {id: 'id2', label: 'label2'}, {id: 'id3', label: 'label3'}];
    element = $compile('<div ng-dropdown-multiselect="" options="options" selected-model="model"></div>')(scope);
    $rootScope.$digest();
    var isolated = element.isolateScope();

    isolated.selectItem('id2');

    expect(scope.model).toEqual([{id: 'id2', label: 'label2'}]);
  });
});


describe('selectAll', function() {
  it('Should select all items', function() {
    var scope = $rootScope.$new();
    scope.model = [];
    scope.options = [{id: 'id1', label: 'label1'}, {id: 'id2', label: 'label2'}, {id: 'id3', label: 'label3'}];
    element = $compile('<div ng-dropdown-multiselect="" options="options" selected-model="model"></div>')(scope);
    $rootScope.$digest();
    var isolated = element.isolateScope();

    isolated.selectAll();

    expect(scope.model.length).toBe(3);
  });


  it('Should trigger onSelectAll event once', function() {
    var scope = $rootScope.$new();
    scope.model = [];
    scope.options = [{id: 'id1', label: 'label1'}, {id: 'id2', label: 'label2'}, {id: 'id3', label: 'label3'}];
    scope.events = {onSelectAll: function() { }};
    spyOn(scope.events, 'onSelectAll');
    element = $compile('<div ng-dropdown-multiselect="" options="options" selected-model="model" events="events"></div>')(scope);
    $rootScope.$digest();
    var isolated = element.isolateScope();

    expect(scope.events.onSelectAll.calls.count()).toEqual(0);
    isolated.selectAll();

    expect(scope.events.onSelectAll).toHaveBeenCalled();
    expect(scope.events.onSelectAll.calls.count()).toEqual(1);
  });

  it('Should not trigger any onItemSelect event', function() {
    var scope = $rootScope.$new();
    scope.model = [];
    scope.options = [{id: 'id1', label: 'label1'}, {id: 'id2', label: 'label2'}, {id: 'id3', label: 'label3'}];
    scope.events = {onItemSelect: function() { }};
    spyOn(scope.events, 'onItemSelect');
    element = $compile('<div ng-dropdown-multiselect="" options="options" selected-model="model" events="events"></div>')(scope);
    $rootScope.$digest();
    var isolated = element.isolateScope();

    isolated.selectAll();

    expect(scope.events.onItemSelect.calls.any()).toEqual(false);
  });
});
