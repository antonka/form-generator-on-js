var A = A || {};

/**
 * @author Anton Karamnov
 */
A.FormView = (function(env) {
    
    var FormView = function(scheme) {
        this.form = this.compileForm(scheme.attributes, scheme.elements);
    };
    
    FormView.prototype = Object.create(env.View.prototype);

    /**
     * @param {string} name
     * @param {object} attributes
     * @returns {string}
     */
    FormView.prototype.compileElement = function(name, attributes) {

        var listTagNamesByFormType = {
            text: 'input',
            password: 'input',
            submit: 'input'
        };

        /**
         * @todo добавить проверку на существоание type в listTagNamesByFormType
         */

        attributes.name = name;

        return this.compileHtmlTag(listTagNamesByFormType[attributes.type], attributes);
    };

    FormView.prototype.compileForm = function(attributes, elements) {

        var templates = {};
        var builtFormBody = '';
        for (var name in elements) {
            var element = elements[name];

            if (element.templateId) {
                if (!templates[element.templateId]) {
                    templates[element.templateId] = env.Template.createFromDOMElement(element.templateId);
                }
                element.attributes.name = name;
                builtFormBody += templates[element.templateId].getWithBoundValues({
                   label: element.label,
                   attributes: this.compileAttributes(element.attributes)
                });
            }
            else {
                builtFormBody += this.compileElement(name, element.attributes);
            }
        }

        return this.compileHtmlTag('form', attributes, builtFormBody);
    };

    FormView.prototype.renderTo = function(id) {
        return env.View.prototype.renderTo.apply(this, [id, this.form]);
    };
    
    return FormView;
    
})(A);




