<template>
    <div>
        <div>
            <button @click="switchToHourly" :class="{active:isHourly}" >{{ $t("by hours") }}</button>
            <button @click="switchToDaily" :class="{active:!isHourly}">{{ $t("by days") }}</button>
        </div>
        <canvas v-if="forecastData.length" ref="weatherChart"></canvas>
    </div>
</template>

<script>
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';

export default {
    props: {
        forecastData: {
            type: Array,
            required: true
        },
        isHourly: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            chart: null
        };
    },
    mounted() {
        Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);
        this.renderChart();
    },
    beforeDestroy() {
        if (this.chart) {
            this.chart.destroy();
        }
    },
    watch: {
        isHourly() {
            this.renderChart();
        },
        forecastData() {
            this.renderChart();
        }
    },
    methods: {
        renderChart() {
            const ctx = this.$refs.weatherChart.getContext('2d');

            if (this.chart) {
                this.chart.destroy();
                this.chart = null;
            }

            const data = this.isHourly
                ? this.forecastData.slice(0, 8)
                : this.forecastData.filter((_, index) => index % 8 === 0);

            this.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.map(item => {
                        const date = new Date(item.dt * 1000);
                        return this.isHourly ? `${date.getHours()}:00` : `${date.getDate()}.${date.getMonth() + 1}`;
                    }),
                    datasets: [{
                        label: 'Temperature (°C)',
                        data: data.map(item => Math.round(item.main.temp - 273.15)),
                        borderColor: 'rgba(75, 192, 192, 1)',
                        fill: false
                    }]
                }
            });
        },
        switchToHourly() {
            this.$emit('update:isHourly', true);
        },
        switchToDaily() {
            this.$emit('update:isHourly', false);
        }
    }
};
</script>
<style scoped>
    button {
        border: 1px solid lightblue;
        padding: 7px;
        min-width: 100px;
        text-transform: uppercase;
        margin-top: 20px;
    }
    button:first-child{
        margin-left: 30px;
    }
    button:last-child{
        margin-left: 5px;
    }
    button.active{
        background-color: aqua;
    }
    
</style>