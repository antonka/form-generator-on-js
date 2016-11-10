var A = A || {};

/**
 * @author Anton Karamnov
 */
A.Form = (function(env){
    
    var Form = function(obj) {
        this.view = this.createView(obj.scheme);
        this.view.renderTo(obj.renderTo);
        this.handler = this.createController(
            obj.scheme.attributes.id, 
            this.prepareElementsToHandler(obj.scheme.elements)
        );
    };
    
    Form.prototype.createView = function(scheme) {
        return new env.FormView(scheme);
    };

    Form.prototype.createController = function(formId, elements) {
        return new env.FormController(formId, elements);
    };

    Form.prototype.prepareElementsToHandler = function(elements) {
        var _elements = {};
        var fieldTypes = ['text', 'password'];
        for (var name in elements) {
            var element = elements[name];
            if (fieldTypes.indexOf(element.attributes.type) === -1) {
                continue;
            }
            _elements[name] =  typeof element.rules === 'undefined' ? {} : element.rules;     
        }
        return _elements;
    };

    Form.prototype.getView = function() {
        return this.view;
    };

    Form.prototype.getController = function() {
        return this.handler;
    };

    return Form;
    
})(A);