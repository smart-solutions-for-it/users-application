<template>
    <div id="app">
        <h1 class="text-primary"><img alt="VueJs project" src="./assets/logo.png">{{title}}</h1>
        <div class="container mt-5">
            <div class="row">
                <div class="col-xs-12 col-sm-12 col-md-6 text-left">
                    <h3>Welcome to my project</h3>
                    <span class="text-secondary">&copy Nitsenko Vladimir</span>
                    <a class="btn btn-link" target="_blank"
                       href="https://www.linkedin.com/in/volodymyr-nitsenko-a08943168/">LinkedIn</a> |
                    <a class="btn btn-link" target="_blank"
                       href="https://www.facebook.com/nicenko.vladimir">Facebook</a>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-3 text-right">
                    <button data-toggle="modal" data-target="#chart" class="btn btn-outline-primary">Show Chart</button>
                </div>
                <div class="col-xs-8 col-sm-8 col-md-3 text-left">
                    <input type="text" class="form-control" placeholder="Search by first name" v-model="search">
                </div>
            </div>
            <hr>
            <user-list :search="search"></user-list>
            <footer class="m-auto mt-3 p-3 bg-light text-center" style="height:75px;">
                <div>
                    <span class="text-secondary">---Footer---</span>
                </div>
                <div>
                    <span class="text-secondary">Some necessary information, contacts</span>
                </div>
            </footer>
        </div>
    </div>
</template>

<script>
    import userList from './components/user-list.component'

    export default {
        name: 'app',
        components: {
            'user-list': userList,
        },
        data() {
            return {
                title: 'VueJs project / Test task',
                search: '',

            }
        },
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
    h1 img {
        width: 100px;
    }
</style>
