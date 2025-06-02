<template>
  <div class="temp-chart">
    <div>
      <button @click="switchToHourly" :class="{ active: isHourly }">{{ $t('by hours') }}</button>
      <button @click="switchToDaily" :class="{ active: !isHourly }">{{ $t('by days') }}</button>
    </div>
    <canvas v-if="isValidData" ref="weatherChart"></canvas>
    <p v-else class="error">{{ $t('No chart data available') }}</p>
  </div>
</template>

<script>
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';
import { debounce } from 'lodash';

export default {
  props: {
    forecastData: {
      type: Array,
      required: true,
    },
    isHourly: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      chart: null,
      isRendering: false,
    };
  },
  computed: {
    isValidData() {
      const isValid = (
        Array.isArray(this.forecastData) &&
        this.forecastData.length > 0 &&
        this.forecastData.every(item => item && item.main && typeof item.main.temp === 'number' && typeof item.dt === 'number')
      );
      return isValid;
    },
  },
  mounted() {
    Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);
    if (this.isValidData) {
      this.renderChart();
    }
  },
  beforeDestroy() {
    this.destroyChart();
  },
  watch: {
    isHourly() {
      this.debouncedRenderChart();
    },
    forecastData: {
      handler() {
        this.debouncedRenderChart();
      },
      deep: true,
    },
  },
  methods: {
    debouncedRenderChart: debounce(function () {
      requestAnimationFrame(() => {
        this.renderChart();
      });
    }, 100),

    renderChart() {
      if (this.isRendering || !this.isValidData) {
        console.warn('TempChart: Skipping render due to invalid data or ongoing render');
        return;
      }

      if (!this.$refs.weatherChart) {
        console.warn('TempChart: Canvas not available');
        return;
      }

      const ctx = this.$refs.weatherChart.getContext('2d');
      if (!ctx) {
        console.warn('TempChart: Canvas context not available');
        return;
      }

      this.isRendering = true;
      this.destroyChart();

      const data = this.forecastData;
      try {
        const labels = data.map(item => {
          const date = new Date(item.dt * 1000);
          if (isNaN(date.getTime())) {
            console.warn('TempChart: Invalid date for dt:', item.dt);
            return 'Invalid';
          }
          return this.isHourly
            ? `${date.getHours().toString().padStart(2, '0')}:00`
            : `${date.getDate()}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        });
        this.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels,
            datasets: [
              {
                label: 'Temperature (°C)',
                data: data.map(item => Math.round(item.main.temp - 273.15)),
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
              },
            ],
          },
          options: {
            animation: false,
            scales: {
              y: {
                beginAtZero: false,
                title: {
                  display: true,
                  text: 'Temperature (°C)',
                },
              },
              x: {
                title: {
                  display: true,
                  text: this.isHourly ? 'Time' : 'Date',
                },
              },
            },
          },
        });
      } catch (error) {
        console.error('TempChart: Error rendering chart:', error);
      } finally {
        this.isRendering = false;
      }
    },

    destroyChart() {
      if (this.chart) {
        try {
          this.chart.destroy();
        } catch (error) {
          console.warn('TempChart: Error destroying chart:', error);
        }
        this.chart = null;
      }
    },

    switchToHourly() {
      this.$emit('update:isHourly', true);
    },

    switchToDaily() {
      this.$emit('update:isHourly', false);
    },
  },
};
</script>