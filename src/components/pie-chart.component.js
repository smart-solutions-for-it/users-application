import {Pie} from "vue-chartjs";

export default {
    extends: Pie,
    props: {
        "data": {
            type: Object
        }
    },
    mounted() {
        this.renderChart(this.data);
    }
};
