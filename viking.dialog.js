Viking.Dialog = Viking.View.extend({

    initialize: function(options) {
        var defaults = {
            clickOff : true
        };

        if (!options) {
            options = {};
        }

        _.extend(this, defaults, options);

        if (options.className) {
            this.$el.addClass(options.className);
        }

        _.bindAll(this, 'close');

        if (this.closeButton) {
            this.closeButton.addClass('close-button');
        }

        this.render();
    },

    render: function() {
        if (this.view) {
            this.$el.html(this.view.render().el);
        } else {
            this.$el.html(this.renderTemplate({model: this.model}));
        }

        if (this.closeButton) {
          this.$el.prepend(this.closeButton);
          this.closeButton.on('click', this.close);
        }

        return this;
    },

    remove: function () {
        if (this.view) {
            this.view.remove();
        }

        this.$overlay.remove();
        this.$wrapper.remove();

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
            this.$overlay = $("<div class='viking-dialog-overlay'></div>");
            if (this.clickOff) {
                this.$overlay.click(this.close);
            }
        }

        if (!this.$wrapper) {
            this.$wrapper = $("<div class='viking-dialog-wrapper'></div>");
            this.$wrapper.append(this.$el);
            if (this.clickOff) {
                this.$wrapper.click(this.close);
            }
        }

        this.$el.addClass('viking-dialog');
        this.$overlay.css({
            zIndex: $('.viking-dialog-overlay').length + options.zIndex,
            opacity: options.overlay.opacity
        });
        this.$wrapper.css({
            zIndex: $('.viking-dialog-wrapper').length + options.zIndex + 1,
            position : options.position,
            top : options.top + $('.viking-dialog-wrapper').length * 87
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
