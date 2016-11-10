var A = A || {};

/**
 * @author Anton Karamnov
 */
A.View = (function(env) {
    
    /**
     * @param {SimpleUI.Template} template
     * @returns {View_L2.View}
     */
    var View = function(template) {
        this.template = template;
    };
    
    /**
    * @param {string} tagName
    * @param {object} attributes
    * @param {string} content
    * @returns {string}
    */
    View.prototype.compileHtmlTag = function(tagName, attributes, content) {

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
    View.prototype.compileAttributes = function(attributes) {
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
    View.prototype.appendTo = function(id, content) {
        var DOMElement = document.getElementById(id);
        DOMElement.innerHTML += content;
    };

    /**
     * @param {String} id
     * @param {Object} obj
     */
    View.prototype.appendRowTo = function(id, obj) {
        this.appendTo(id, this.template.getWithBoundValues(obj));
    };

    /**
     * @param {string} id when render
     * @param {string} content what render
     */
    View.prototype.renderTo = function(id, content) {
        var container = document.getElementById(id);
        container.innerHTML = content;
    };

    View.prototype.renderRowTo = function(id, obj) {
        this.renderTo(id, this.template.getWithBoundValues(obj));
    };

    /**
     * @param {string} id element id when render
     * @param {array} range переменные для заполнения
     * @returns {String}
     */
    View.prototype.renderRowsTo = function(id, range) {
        this.renderTo(id, this.template.getManyRowsWithBoundValues(range));
    };

    /**
     * @param {type} id
     * @returns View
     */
    View.createViewFromTemplate = function(id) {
        return new View(env.Template.createFromDOMElement(id));
    };
    
    return View;
    
})(A);


