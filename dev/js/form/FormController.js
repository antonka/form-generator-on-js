var A = A || {};

/**
 * @author Anton Karamnov
 */
A.FormController = (function(env) {
    
    var FormController = function(formId, elements) {
        var self = this;
        this.elements = elements;
        this.form = document.getElementById(formId);
        this.form.addEventListener('submit', function(event) {
            event.preventDefault();
            self.submit(event, self.getValues());
        });
    };
    
    FormController.prototype.getValues = function() {
        var values = {};
        for (var name in this.elements) {
            values[name] = this.form.elements[name].value.trim();
        }
        return values;
    };

    FormController.prototype.fill = function(values) {
        for (var name in values) {
            /**
             * @todo добавить проверку ну существование элемента в форме
             */
            this.form.elements[name].value = values[name];
        }
    };

    FormController.prototype.submit = function(event, values) {
        console.log('CALL handler event submit of form');
        console.log(values);
    };
    
    return FormController;  
    
})(A);


