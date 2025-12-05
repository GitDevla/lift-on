import {
    CategoryScale,
    Chart as ChartJS,
    LinearScale,
    LineElement,
    PointElement,
} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Line } from "react-chartjs-2";

export interface OneRepMaxStat {
    one_rm: number
    workout_date: string
}

export default function OneRepMaxGraph({ stats }: { stats: OneRepMaxStat[] }) {
    ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartDataLabels);

    return (
        <Line
            datasetIdKey="id"
            plugins={
                [ChartDataLabels]
            }
            options={{
                responsive: true,
                plugins: {
                    legend: {
                        display: false,
                    },
                },
                hover: {
                    mode: 'index',
                },

                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: '1RM (kg)',
                        },
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date',
                        },
                    },
                },
            }}
            data={{
                labels: [...stats.map(stat => stat.workout_date).map(dateStr => {
                    const date = new Date(dateStr);
                    return `${date.getDate()}/${date.getMonth() + 1}`;
                })],
                datasets: [
                    {
                        label: "",
                        data: [...stats.map(stat => stat.one_rm).map(value => Math.round(value))],
                        borderColor: "rgb(53, 162, 235)",
                        backgroundColor: "rgba(53, 162, 235, 0.5)",
                        cubicInterpolationMode: "monotone",
                    },
                ],
            }}
        />
    );
}