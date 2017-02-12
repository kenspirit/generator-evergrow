var columns = [{
  field: 'createdAt',
  title: 'Created At',
  width: 60,
  align: 'center',
  halign: 'center',
  formatter: timeFormatter
}, {
  field: 'createdUser',
  title: 'Created By',
  width: 60,
  align: 'center',
  halign: 'center'
}, {
  field: 'updatedAt',
  title: 'Updated At',
  width: 60,
  align: 'center',
  halign: 'center',
  formatter: timeFormatter
}, {
  field: 'updatedUser',
  title: 'Updated By',
  width: 60,
  align: 'center',
  halign: 'center'
}, {
  field: 'deleted',
  title: 'Deleted?',
  width: 60,
  align: 'center',
  halign: 'center',
  formatter: function(value, row, index) {
    return value === true ? 'Deleted' : ''
  }
}, {
  field: '',
  title: '',
  width: 60,
  align: 'center',
  halign: 'center',
  events: {
    'click .edit': (e, value, row, index, activeBtn) => {
      $('#<%= modulenameLowerCase %>Id').val(row._id)
      $('#<%= modulenameLowerCase %>Dialog').modal('toggle')
    }
  },
  formatter: function(value, row, index) {
    return `<div class="btn-group dropdown">
      <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Action <span class="caret"></span>
      </button>
      <ul class="dropdown-menu">
        <li class="edit"><a href="#">Edit</a></li>
      </ul>
    </div>`
  }
}]

var vue = new Vue({
  el: '#<%= modulenameLowerCase %>List',
  data: {
    url: '/<%= modulenameLowerCase %>',
    pageList: [10, 20, 30],
    errorMsg: ''
  },
  ready: function() {
    $('#<%= modulenameLowerCase %>Table').bootstrapTable({
      columns: columns,
      queryParams: (p) => {
        for (var v in self.params) {
          p[v] = self.params[v]
        }

        return p
      }
    })
  },
  methods: {
    create<%= modulename %>: function() {
      window.location = '/<%= modulenameLowerCase %>/page/load'
    },
    save<%= modulename %>: function() {
      var id = $('#<%= modulenameLowerCase %>Id').val()

      var params = {
        method: 'post',
        url: '/<%= modulenameLowerCase %>/' + id,
        data: {}
      }

      ajaxRequest(params, (data) => {
        $('#<%= modulenameLowerCase %>Table').bootstrapTable('refresh')
        $('#<%= modulenameLowerCase %>Dialog').modal('toggle')
      })
    }
  }
});
