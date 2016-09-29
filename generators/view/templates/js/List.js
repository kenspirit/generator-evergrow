var options = {
  el: '#<%= modulenameLowerCase %>List',
  data: {
    pageTitle: '<%= modulename %> List',
    errorMsg: ''
  },
  methods: {
    renderSystemTime: function(updatedAt) {
      return moment(updatedAt).format('YYYY-MM-DD HH:mm:ss')
    },
    get<%= modulenamePluralized %>: function(page, limit) {
      var that = this

      $.get('/<%= modulenameLowerCase %>?page=' + page + '&limit=' + limit)
        .done(function(result) {
          vue.paging.<%= modulenameLowerCase %>.currentPage = page
          vue.paging.<%= modulenameLowerCase %>.data = result.data.records
          vue.paging.<%= modulenameLowerCase %>.totalCount = result.data.totalCount

          that.initPagingInfo(vue.paging.<%= modulenameLowerCase %>)
        })
        .fail(handleErrorResponse.bind(this))
    },
    create<%= modulename %>: function() {
      location.href = '/<%= modulenameLowerCase %>/page/load/'
    }
  }
}

mergeVuePagingOptions(options, ['<%= modulenameLowerCase %>'])

var vue = new Vue(options)
vue.get<%= modulenamePluralized %>(1, vue.recordPerPageOptions[0])
