'use strict';

var A = A || {};

/**
 * @author Anton Karamnov
 */
A.Template = function (env) {

    var Template = function Template(template) {
        this.compiledTemplate = this.compile(template);
    };

    /**
     * @param {string} template
     * @returns {Function}
     */
    Template.prototype.compile = function (template) {

        var parsedTemplate = template.replace(/\s+/g, ' ').split('"').join('\\"').split('{{').join('" + ').split('}}').join(' + "');

        var functionBody = 'var str = ""; with (data) { str = "' + parsedTemplate + '"; } ' + 'return str;';

        return new Function('data', functionBody);
    };

    /**
     * @param {object} obj
     * @returns {string}
     */
    Template.prototype.getWithBoundValues = function (obj) {
        return this.compiledTemplate.apply(null, [obj]);
    };

    /**
     * @param {array} range
     * @returns {string}
     */
    Template.prototype.getManyRowsWithBoundValues = function (range) {
        var builtString = '';
        for (var i = 0; i < range.length; i++) {
            builtString += this.getWithBoundValues(range[i]);
        }return builtString;
    };

    Template.createFromDOMElement = function (id) {
        var element = document.getElementById(id);
        return new Template(element.innerHTML);
    };

    return Template;
}(A);
'use strict';

var A = A || {};

/**
 * @author Anton Karamnov
 */
A.View = function (env) {

    /**
     * @param {SimpleUI.Template} template
     * @returns {View_L2.View}
     */
    var View = function View(template) {
        this.template = template;
    };

    /**
    * @param {string} tagName
    * @param {object} attributes
    * @param {string} content
    * @returns {string}
    */
    View.prototype.compileHtmlTag = function (tagName, attributes, content) {

        /**
         * @todo добавить проверку на входящие аргументы
         */

        var listTagsHasEndTag = ['div', 'form', 'li'];
        var tag = '<' + tagName + this.compileAttributes(attributes) + '>';

        if (content) {
            tag += content;
        }

        if (listTagsHasEndTag.indexOf(tagName) > -1) {
            tag += '</' + tagName + '>';
        }

        return tag;
    };

    /**
     * @param {Object} attributes
     * @returns {String}
     */
    View.prototype.compileAttributes = function (attributes) {
        var str = '';
        for (var name in attributes) {
            str += ' ' + name + '="' + attributes[name] + '"';
        }
        return str;
    };

    /**
     * @param {String} id
     * @param {String} content
     */
    View.prototype.appendTo = function (id, content) {
        var DOMElement = document.getElementById(id);
        DOMElement.innerHTML += content;
    };

    /**
     * @param {String} id
     * @param {Object} obj
     */
    View.prototype.appendRowTo = function (id, obj) {
        this.appendTo(id, this.template.getWithBoundValues(obj));
    };

    /**
     * @param {string} id when render
     * @param {string} content what render
     */
    View.prototype.renderTo = function (id, content) {
        var container = document.getElementById(id);
        container.innerHTML = content;
    };

    View.prototype.renderRowTo = function (id, obj) {
        this.renderTo(id, this.template.getWithBoundValues(obj));
    };

    /**
     * @param {string} id element id when render
     * @param {array} range переменные для заполнения
     * @returns {String}
     */
    View.prototype.renderRowsTo = function (id, range) {
        this.renderTo(id, this.template.getManyRowsWithBoundValues(range));
    };

    /**
     * @param {type} id
     * @returns View
     */
    View.createViewFromTemplate = function (id) {
        return new View(env.Template.createFromDOMElement(id));
    };

    return View;
}(A);
'use strict';

var A = A || {};

/**
 * @author Anton Karamnov
 */
A.Form = function (env) {

    var Form = function Form(obj) {
        this.view = this.createView(obj.scheme);
        this.view.renderTo(obj.renderTo);
        this.handler = this.createController(obj.scheme.attributes.id, this.prepareElementsToHandler(obj.scheme.elements));
    };

    Form.prototype.createView = function (scheme) {
        return new env.FormView(scheme);
    };

    Form.prototype.createController = function (formId, elements) {
        return new env.FormController(formId, elements);
    };

    Form.prototype.prepareElementsToHandler = function (elements) {
        var _elements = {};
        var fieldTypes = ['text', 'password'];
        for (var name in elements) {
            var element = elements[name];
            if (fieldTypes.indexOf(element.attributes.type) === -1) {
                continue;
            }
            _elements[name] = typeof element.rules === 'undefined' ? {} : element.rules;
        }
        return _elements;
    };

    Form.prototype.getView = function () {
        return this.view;
    };

    Form.prototype.getController = function () {
        return this.handler;
    };

    return Form;
}(A);
'use strict';

var A = A || {};

/**
 * @author Anton Karamnov
 */
A.FormController = function (env) {

    var FormController = function FormController(formId, elements) {
        var self = this;
        this.elements = elements;
        this.form = document.getElementById(formId);
        this.form.addEventListener('submit', function (event) {
            event.preventDefault();
            self.submit(event, self.getValues());
        });
    };

    FormController.prototype.getValues = function () {
        var values = {};
        for (var name in this.elements) {
            values[name] = this.form.elements[name].value.trim();
        }
        return values;
    };

    FormController.prototype.fill = function (values) {
        for (var name in values) {
            /**
             * @todo добавить проверку ну существование элемента в форме
             */
            this.form.elements[name].value = values[name];
        }
    };

    FormController.prototype.submit = function (event, values) {
        console.log('CALL handler event submit of form');
        console.log(values);
    };

    return FormController;
}(A);
'use strict';

var A = A || {};

/**
 * @author Anton Karamnov
 */
A.FormView = function (env) {

    var FormView = function FormView(scheme) {
        this.form = this.compileForm(scheme.attributes, scheme.elements);
    };

    FormView.prototype = Object.create(env.View.prototype);

    /**
     * @param {string} name
     * @param {object} attributes
     * @returns {string}
     */
    FormView.prototype.compileElement = function (name, attributes) {

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

    FormView.prototype.compileForm = function (attributes, elements) {

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
            } else {
                builtFormBody += this.compileElement(name, element.attributes);
            }
        }

        return this.compileHtmlTag('form', attributes, builtFormBody);
    };

    FormView.prototype.renderTo = function (id) {
        return env.View.prototype.renderTo.apply(this, [id, this.form]);
    };

    return FormView;
}(A);