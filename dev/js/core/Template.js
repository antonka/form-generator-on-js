var A = A || {};

/**
 * @author Anton Karamnov
 */
A.Template = (function(env) {
    
    var Template = function(template) {
        this.compiledTemplate = this.compile(template);
    };
     
    /**
     * @param {string} template
     * @returns {Function}
     */
    Template.prototype.compile = function(template) {

        var parsedTemplate = template
                                .replace(/\s+/g, ' ')
                                .split('"').join('\\"')
                                .split('{{').join('" + ')
                                .split('}}').join(' + "');

        var functionBody = 'var str = ""; with (data) { str = "'
                         + parsedTemplate
                         + '"; } '
                         + 'return str;';

        return new Function('data', functionBody);
    };

   /**
    * @param {object} obj
    * @returns {string}
    */
    Template.prototype.getWithBoundValues = function(obj) {
        return this.compiledTemplate.apply(null, [obj]);
    };

   /**
    * @param {array} range
    * @returns {string}
    */
    Template.prototype.getManyRowsWithBoundValues = function(range) {
        var builtString = '';
        for (var i = 0; i < range.length; i++)
            builtString += this.getWithBoundValues(range[i]);
        return builtString;
    };

    Template.createFromDOMElement = function(id) {
        var element = document.getElementById(id);
        return new Template(element.innerHTML);
    };
    
    return Template;
    
})(A);



