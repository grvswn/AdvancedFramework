const forms = require('forms');

const fields = forms.fields;
const validators = forms.validators;

const createProductForm = () => {
    return forms.create({   
        name: fields.string({
            required: true,
            errorAfterField: true
        }),
        cost:fields.string({
            required: true,
            errorAfterField: true,
            validators:[validators.integer()]
        }),
        description: fields.string({
            required: true,
            errorAfterField: true
        })
    })
}

const bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};

module.exports = {createProductForm, bootstrapField}