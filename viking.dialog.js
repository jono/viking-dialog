Viking = Viking || {};

Viking.Dialog = Viking.View.extend({

    constructor: function() {
        Backbone.View.apply(this, arguments);
    },

    initialize: function(options) {
        if (!options) {
            options = {};
        }

        this.view           = options.view;
        this.template       = options.template;
        this.clickOff       = options.hasOwnProperty('clickOff') ? options.clickOff : true;
        this.$closeButton   = options.closeButton ? $(options.closeButton) : null;

        if (options.className) {
            this.$el.addClass(options.className);
        }

        _.bindAll(this, 'resize', 'close');
        $(window).on('resize', this.resize);

        if (this.$closeButton) {
            this.$closeButton.addClass('close-button');
        }

        this.render();
    },

    render: function() {
        if (this.view) {
            this.$el.html(this.view.render().el);
        } else {
            this.$el.html(this.renderTemplate({model: this.model}));
        }

        if (this.$closeButton) {
          this.$el.prepend(this.$closeButton);
          this.$closeButton.on('click', this.close);
        }

        return this;
    },

    resize: function () {},

    remove: function () {
        if (this.view) {
            this.view.remove();
        }

        this.$overlay.remove();
        this.$wrapper.remove();
        $(window).off('resize', this.resize);

        Backbone.View.prototype.remove.apply(this, arguments);
    },

    show: function(options) {
        options = $.extend(true, {
            top: 75,
            overlay: {opacity: 0.3},
            position: "absolute",
            zIndex: 999
        }, options);

        if (!this.$overlay) {
            this.$overlay = $("<div class='viking-modal-overlay'></div>");
            if (this.clickOff) {
                this.$overlay.click(this.close);
            }
        }

        if (!this.$wrapper) {
            this.$wrapper = $("<div class='viking-modal-wrapper'></div>");
            this.$wrapper.append(this.$el);
            if (this.clickOff) {
                this.$wrapper.click(this.close);
            }
        }

        this.$el.addClass('viking-modal');
        this.$overlay.css({
            zIndex: $('.viking-modal-overlay').length + options.zIndex,
            opacity: options.overlay.opacity
        });
        this.$wrapper.css({
            zIndex: $('.viking-modal-wrapper').length + options.zIndex + 1,
            position : options.position,
            top : options.top + $('.viking-modal-wrapper').length * 87
        });

        $('body').append(this.$overlay)
                 .append(this.$wrapper);

        this.trigger('open');
        this.$("select, textarea, input:not([type=checkbox]):not([type=hidden])").first().focus();

        return this;
    },

    close: function(e) {
        if (e && $.contains(this.$wrapper.get(0), e.target) && !$(e.target).hasClass('close-button')) {
            return;
        }

        if (e) {
            e.preventDefault();
            if (e.currentTarget !== e.target) {
                return false;
            }
        }
        this.trigger('close');
        this.remove();
    }

});
