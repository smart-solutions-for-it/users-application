<template>
  <div class="container-fluid">
    <template v-if="showedUsers.users.length">
      <table class="table table-striped">
        <thead>
        <tr>
          <th></th>
          <th>Last</th>
          <th>First</th>
          <th>Username</th>
          <th>Phone</th>
          <th>Location</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <template v-for="(user, index) in showedUsers.users">
          <tr :key="'user' + index"
              :class="{'active' : selectedUser === user, 'table-secondary' : index%2===0}">
            <td class="align-middle">
              <img :alt="user.name.first"
                   class="rounded-circle img-thumbnail"
                   :src="user.picture.medium"
              >
            </td>
            <td class="align-middle">{{user.name.last | titlecase}}</td>
            <td class="align-middle">{{user.name.first | titlecase}}</td>
            <td class="align-middle">{{user.login.username}}</td>
            <td class="align-middle">{{user.phone}}</td>
            <td class="align-middle">{{user.location.state | titlecase}}</td>
            <td class="align-middle">
              <button @click='selectUser(user)' class="btn btn-outline-dark btn-control">
                <span>{{ selectedUser === user && selectedNow ? '-' : '+'}}</span>
              </button>
            </td>
          </tr>
          <transition name="details" :key="'user'+index">
            <user-detail :user="user" v-show="selectedUser === user && selectedNow"></user-detail>
          </transition>
        </template>
        </tbody>
      </table>

      <!--pagination-->
      <nav v-if="paginationUsers.length">
        <ul class="pagination pagination-md">
          <li v-for="data in paginationUsers" @click="showUsers(data)" :key="data.page"
              :class="{'active': showedUsers.page===data.page}" class="page-item"
              aria-current="page">
            <a class="page-link">{{data.page}}</a></li>
        </ul>
      </nav>
    </template>
    <div class="text-danger" v-if="!showedUsers.users.length && users.length">Not founded users.
      Please change your search query
    </div>
    <div class="alert alert-danger" v-if="errorMessage">{{ errorMessage }}</div>

    <!--modal window-->
    <div class="modal fade" id="chart" tabindex="-1" role="dialog" aria-labelledby="title" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="title">Gender Users</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <pie-chart v-if="users.length" :data="chartData"></pie-chart>
        </div>
      </div>
    </div>
    <!---->
  </div>
</template>

<script>
  import PieChart from "./pie-chart.component";
  import userDetail from "./user-detail.component";

  export default {
    name: 'user-list',
    components: {
      'user-detail': userDetail,
      PieChart
    },
    props: {
      search: {
        type: String
      }
    },
    filters: {
      titlecase(value) {
        return value[0].toUpperCase() + value.slice(1);
      }
    },
    watch: {
      search: function () {
        this.filterUsers();
      }
    },
    data() {
      return {
        url: 'https://randomuser.me/api/?results=30',
        users: [],
        filteredUsers: [],
        paginationUsers: [],
        showedUsers: {
          page: null,
          users: []
        },
        selectedUser: null,
        selectedNow: false,
        usersOnPage: 10,
        errorMessage: '',
        male: 0,
        female: 0
      }
    },
    methods: {
      filterUsers() {
        this.filteredUsers = this.users.filter(user => user.name.first.match(this.search.toLowerCase()));
        this.paginationUsers = this.searchUsers();
      },
      selectUser(user) {
        this.selectedNow = (!(this.selectedNow && this.selectedUser === user));
        this.selectedUser = user;
      },
      showUsers(data) {
        this.showedUsers = {
          page: data.page,
          users: data.users
        }
      },
      searchUsers() {
        let pages = Math.ceil(this.filteredUsers.length / this.usersOnPage);
        let users = Array(pages);
        for (let i = 0; i < pages; i++) {
          let numbers = i * this.usersOnPage;
          users[i] = ({
            page: i + 1,
            users: this.filteredUsers.slice(numbers, numbers + this.usersOnPage)
          });
        }

        if (users.length > 0) {
          this.showedUsers = {
            page: users[0].page,
            users: users[0].users
          }
        } else {
          this.showedUsers = {
            page: null,
            users: []
          }
        }
        return users;
      }
    },
    computed: {
      chartData() {
        return {
          labels: ["Female", "Male"],
          datasets: [
            {
              label: "Data One",
              backgroundColor: ["pink", "lightblue"],
              data: [this.male, this.female]
            }
          ]
        }
      },
    },
    created() {

      this.$http.get(this.url).then(response => {
            this.users = response.body.results;
            this.showedUsers = {
              page: 1,
              users: this.users.slice(0, this.usersOnPage)
            },
                this.users.forEach(user => user.gender === 'male' ? this.male++ : this.female++);
            this.filterUsers();
          },
          error => this.errorMessage = error.body.error);
    },
  }
</script>

<style scoped>
  .btn-outline-dark {
    border: none !important;
    font-weight: bold;
    font-size: 50px;
  }

  .details-enter-active, .details-leave-active {
    transition: all ease .5s;
  }

  .details-enter {
    transform: translateY(50px);
    opacity: 0;
  }

  .details-leave-to {
    transform: translateY(-50px);
    opacity: 0;
  }

  .btn-control {
    width: 80px;
    height: 80px;
  }

  .page-item {
    cursor: pointer;
  }

</style>
