'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var angular = require('angular');
var drdCommon = require('../index');

require('angular-mocks');

var module = angular.mock.module;
var inject = angular.mock.inject;

describe('cam-common CamTabsController', function() {
  var $scope;
  var providers;
  var Views;
  var search;
  var params;
  var instance;

  beforeEach(module(drdCommon.name));

  beforeEach(inject(function($controller, $rootScope) {
    $scope = $rootScope.$new();
    $scope.providerParams = 'providerParams';
    $scope.tabsApi = 'tabsApi';

    providers = [
      {
        id:'a'
      },
      {
        id: 'b'
      }
    ];

    Views = {
      getProviders: sinon.stub().returns(providers)
    };

    params = {};

    search = sinon.stub().returns(params);
    search.updateSilently = sinon.spy();

    instance = $controller('CamTabsController', {
      $scope: $scope,
      Views: Views,
      search: search
    });
  }));

  it('should fetch providers for cockpit.drd.definition.tab', function() {
    expect(instance.providers).to.eql(providers);
    expect(Views.getProviders.calledWith($scope.providerParams)).to.eql(true);
  });

  it('should select first provider', function() {
    expect(instance.selected).to.eql(providers[0]);
  });

  it('should create varsAPI', function() {
    expect($scope.tabsApi).to.eql('tabsApi');
    expect(instance.vars).to.eql({
      read: ['tabsApi']
    });
  });

  describe('onLocationChange', function() {
    beforeEach(function() {
      search.reset();
    });

    it('should get params from search service', function() {
      instance.onLocationChange();

      expect(search.calledOnce).to.eql(true);
    });

    it('should update selected tab when changed', function() {
      var params = {
        tab: 'b'
      };

      search.returns(params);

      instance.onLocationChange();

      expect(instance.selected).to.eql(providers[1]);
    });

    it('should not update selected tab when not changed', function() {
      var selected =  {
        id: 'b',
        extra: 's'
      };
      var params = {
        tab: 'b'
      };

      instance.selected = selected;

      search.returns(params);

      instance.onLocationChange();

      expect(instance.selected).to.eql(selected);
    });

    it('should not update selected tab when params do not have tab', function() {
      var selected =  {
        id: 'b',
        extra: 's'
      };
      instance.selected = selected;

      instance.onLocationChange();

      expect(instance.selected).to.eql(selected);
    });
  });

  describe('selectTab', function() {
    var provider;
    var params;

    beforeEach(function() {
      provider = {
        id: 'c'
      };

      params = {
        a: 1
      };

      search.returns(params);

      instance.selectTab(provider);
    });

    it('should set given provider as selected', function() {
      expect(instance.selected).to.eql(provider);
    });

    it('should update search with new tab and not change other params', function() {
      expect(search.updateSilently.calledWith({
        a: 1,
        tab: provider.id
      }));
    });
  });

  describe('isSelected', function() {
    it('should return true for selected provider', function() {
      var provider = 'd';

      instance.selected = provider;

      expect(instance.isSelected(provider)).to.eql(true);
    });

    it('should return false for not selected provider', function() {
      instance.selected = Math.random();

      expect(instance.isSelected('dd')).to.eql(false);
    });
  });
});
