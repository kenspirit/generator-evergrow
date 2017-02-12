$(document).ready(function () {
  var vue = new Vue({
    el: '#<%= modulenameLowerCase %>Profile',
    data: {
      errorMsg: '',
      successMsg: '',
      pageTitle: '<%= modulename %> Profile',
      submitUrl: '/<%= modulenameLowerCase %>'
    },
    methods: {
      get<%= modulename %>: function() {
        $.get(this.submitUrl)
          .done(function (result) {
            var <%= modulenameLowerCase %> = result.data
          })
          .fail(handleErrorResponse.bind(this))
      },
      update<%= modulename %>: function() {
        var body = {}

        var that = this
        $.post(this.submitUrl, body)
          .done(function (result) {
            that.successMsg = '更新成功'
            that.errorMsg =  ''
          })
          .fail(handleErrorResponse.bind(this))
      },
      renderSystemTime: timeFormatter
    }
  })

  $('#<%= modulenameLowerCase %>-profile').validate({
    errorClass: "state-error",
    highlight: function(element, errorClass, validClass) {
      $(element).closest('.field').addClass(errorClass).removeClass(validClass);
    },
    submitHandler: function (form) {
      vue.update<%= modulename %>();
    }
  });

  var <%= modulenameLowerCase %>Id = $('#<%= modulenameLowerCase %>Id').val();
  if (<%= modulenameLowerCase %>Id) {
    vue.<%= modulenameLowerCase %>Id = <%= modulenameLowerCase %>Id
    vue.submitUrl += '/' + <%= modulenameLowerCase %>Id
    vue.get<%= modulename %>()
  }

})
