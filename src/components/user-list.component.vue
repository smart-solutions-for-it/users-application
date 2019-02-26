<template>
    <div class="container">
        <div v-if="users">
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
                <tbody v-for="(user, index) in filteredUsers.slice(currentPage,currentPage+10)"
                       v-bind:key="'user' + index"
                >
                <tr :class="{'active' : selectedUser === user, 'table-secondary' : index%2===0}">
                    <td class="align-middle"><img :alt="user.name.first" class="rounded-circle img-thumbnail"
                                                  :src="user.picture.medium"></td>
                    <td class="align-middle">{{user.name.last | titlecase}}</td>
                    <td class="align-middle">{{user.name.first | titlecase}}</td>
                    <td class="align-middle">{{user.login.username}}</td>
                    <td class="align-middle">{{user.phone}}</td>
                    <td class="align-middle">{{user.location.state | titlecase}}</td>
                    <td class="align-middle">
                        <button @click='selectUser(user)' class="btn btn-outline-dark" style="width:80px; height:80px">
                            <span>{{ selectedUser === user && selectedNow ? '-' : '+'}}</span>
                        </button>
                    </td>
                </tr>
                <transition name="details">
                    <tr v-show="selectedUser === user && selectedNow" class="text-secondary text-left small">
                        <td colspan="3" class="align-bottom">
                            <h4>{{user.name.first | titlecase}}
                                <img style="width:40px" src="../assets/male.png" v-if="user.gender==='male'">
                                <img style="width:20px" src="../assets/female.png" v-if="user.gender==='female'">
                            </h4>
                            <div>
                                <strong>Username:</strong> {{user.login.username}}
                            </div>
                            <div>
                                <strong>Registered:</strong> {{calculateDate(user.registered.date)}}
                            </div>
                            <div>
                                <strong>Email:</strong> {{user.email}}
                            </div>
                        </td>
                        <td class="align-bottom">
                            <div>
                                <strong>Address:</strong> {{user.location.street}}
                            </div>
                            <div>
                                <strong>City:</strong> {{user.location.city}}
                            </div>
                            <div>
                                <strong>Zip Code:</strong> {{user.location.postcode}}
                            </div>
                        </td>
                        <td class="align-bottom">
                            <div>
                                <strong>Birthday:</strong> {{calculateDate(user.dob.date)}}
                            </div>
                            <div>
                                <strong>Phone:</strong> {{user.phone}}
                            </div>
                            <div>
                                <strong>Cell:</strong> {{user.cell}}
                            </div>
                        </td>
                        <td colspan="4" class="align-bottom text-center">
                            <img :alt="user.name.first" class="rounded-circle img-thumbnail"
                                 :src="user.picture.medium" style="width:50%;">
                        </td>
                    </tr>
                </transition>
                </tbody>
            </table>
            <div class="text-danger" v-if="filteredUsers.length===0 && users.lenght!==0">Not founded users. Please
                change
                your search query
            </div>
            <!--pagination-->
            <nav>
                <ul class="pagination pagination-md">
                    <li @click="currentPage=0" :class="{'active': currentPage===0}" class="page-item"
                        aria-current="page">
                              <span class="page-link">1
        <span class="sr-only">(current)</span>
        </span>
                    </li>
                    <li v-show="filteredUsers.length>10" @click="currentPage=10" class="page-item"
                        :class="{'active': currentPage===10}"><a
                            class="page-link">2</a></li>
                    <li v-show="filteredUsers.length>20" @click="currentPage=20" class="page-item"
                        :class="{'active': currentPage===20}"><a
                            class="page-link">3</a></li>
                </ul>
            </nav>
        </div>
        <div class="alert alert-danger" v-if="errorMessage">{{ errorMessage }}</div>
        <div class="modal fade" id="chart" tabindex="-1" role="dialog" aria-labelledby="title" aria-hidden="true">

            <!--modal window-->
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
    import PieChart from "./pie-chartcomponent.js";

    export default {
        name: 'user-list',
        components: {
            PieChart
        },
        props: ['search'],
        filters: {
            titlecase(value) {
                return value[0].toUpperCase() + value.slice(1);
            }
        },
        data() {
            return {
                url: 'https://randomuser.me/api/?results=30',
                users: [],
                errorMessage: '',
                selectedUser: null,
                currentPage: 0,
                selectedNow: false,
                male: 0,
                female: 0,
            }
        },
        methods: {
            selectUser(user) {
                this.selectedNow = (!(this.selectedNow && this.selectedUser === user));
                this.selectedUser = user;
            },
            calculateDate(GMTdate) {
                let date = new Date(Date.parse(GMTdate));
                return this.addZero(date.getDate()) + "/" + (this.addZero(date.getMonth() + 1)) + "/" + date.getFullYear();
            },
            addZero(num) {
                return num < 10 ? `0${num}` : num;
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
            filteredUsers() {
                let filteredUsers = [];
                if (this.search) {
                    filteredUsers = this.users.filter(user => user.name.first.match(this.search.trim().toLowerCase()));
                    if (filteredUsers.length <= 10) {
                        this.currentPage = 0;
                    }
                    if (filteredUsers.length > 10 && filteredUsers.lenght <= 20) {
                        this.currentPage = 10;
                    }
                    if (filteredUsers.length > 20) {
                        this.currentPage = 20;
                    }
                } else {
                    filteredUsers = this.users;
                }
                return filteredUsers;
            }
        },
        mounted() {
            this.$http.get(this.url).then(response => {
                    this.users = response.body.results;
                    this.users.forEach(user => user.gender === 'male' ? this.male++ : this.female++);
                },
                error => this.errorMessage = error.body.error);
        }
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
</style>
