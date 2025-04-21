import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import * as Chart from 'chart.js';
import "chart.js/auto";

const API_URL = "http://127.0.0.1:5000/api/sensor_data";

const standardRanges = {
  soil_moisture: { min: 30, max: 70 },
  soil_temperature: { min: 15, max: 30 },
  pH: { min: 6.5, max: 7.5 },
  ec: { min: 1.2, max: 2.0 },
  nitrogen: { min: 20, max: 40 },
  phosphorus: { min: 10, max: 30 },
  potassium: { min: 100, max: 250 },
  water_tds: { min: 100, max: 500 },
};

const parameterIcons = {
  soil_moisture: "💧",
  soil_temperature: "🌡️",
  pH: "⚗️",
  ec: "⚡",
  nitrogen: "🌱",
  phosphorus: "🌿",
  potassium: "🍃",
  water_tds: "💦",
};

const formatParameterName = (name) => {
  return name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const CertificationProgressBar = ({ certification }) => {
  let progress = 0;
  let statusText = "";

  if (certification.includes("Full")) {
    progress = 100;
    statusText = "Full Organic Certification";
  } else if (certification.includes("Intermediate")) {
    progress = 70;
    statusText = "Intermediate Certification";
  } else {
    progress = 40;
    statusText = "Basic Certification";
  }

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
      <div className="px-6 py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Certification Progress</h2>
          <div className="flex items-center">
            <span className="font-bold text-lg text-green-600">{progress}%</span>
          </div>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-4 mb-6 overflow-hidden">
          <div
            className="h-4 rounded-full bg-gradient-to-r from-green-300 via-green-500 to-green-600"
            style={{
              width: `${progress}%`,
              transition: "width 1.5s cubic-bezier(0.4, 0, 0.2, 1)"
            }}
          ></div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col items-center">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${progress >= 40 ? "bg-green-500 text-white" : "bg-gray-200"}`}>
              {progress >= 40 && <span className="text-xs">✓</span>}
            </div>
            <span className="text-sm mt-1">Basic</span>
          </div>
          <div className="flex flex-col items-center">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${progress >= 70 ? "bg-green-500 text-white" : "bg-gray-200"}`}>
              {progress >= 70 && <span className="text-xs">✓</span>}
            </div>
            <span className="text-sm mt-1">Intermediate</span>
          </div>
          <div className="flex flex-col items-center">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${progress >= 100 ? "bg-green-500 text-white" : "bg-gray-200"}`}>
              {progress >= 100 && <span className="text-xs">✓</span>}
            </div>
            <span className="text-sm mt-1">Full Organic</span>
          </div>
        </div>

        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
          <div className="flex items-center">
            <span className="text-xl mr-2">🌱</span>
            <div>
              <p className="font-medium text-green-800">{statusText}</p>
              <p className="text-sm text-green-700 mt-1">
                {progress < 100 ? "Continue implementing sustainable practices to achieve full certification." : "Congratulations! You've achieved full organic certification."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TimelineGraph = () => {
  const [timelineView, setTimelineView] = useState("weekly");
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const parameters = {
    soil_moisture: { min: 30, max: 70, color: "#3B82F6" },
    soil_temperature: { min: 15, max: 30, color: "#F97316" },
    pH: { min: 6.5, max: 7.5, color: "#8B5CF6" },
    ec: { min: 1.2, max: 2.0, color: "#06B6D4" },
    nitrogen: { min: 20, max: 40, color: "#10B981" },
    phosphorus: { min: 10, max: 30, color: "#EC4899" },
    potassium: { min: 100, max: 250, color: "#F59E0B" },
    water_tds: { min: 100, max: 500, color: "#6366F1" },
  };

  const generateTimelineData = (view) => {
    const labels = view === "weekly"
      ? ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
      : ["Week 1", "Week 2", "Week 3", "Week 4"];

    const dataPoints = {};
    Object.keys(parameters).forEach(param => {
      const { min, max } = parameters[param];
      const midPoint = (min + max) / 2;
      const variance = (max - min) / 4;

      dataPoints[param] = labels.map((_, i) => {
        const trendFactor = view === "weekly"
          ? Math.sin((i / (labels.length - 1)) * Math.PI) * variance
          : (i < labels.length / 2 ? i / (labels.length / 2) : (labels.length - i) / (labels.length / 2)) * variance;

        return Math.max(min, Math.min(max, midPoint + trendFactor + (Math.random() * variance * 0.5)));
      });
    });

    return { labels, dataPoints };
  };

  useEffect(() => {
    const { labels, dataPoints } = generateTimelineData(timelineView);

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const datasets = Object.keys(parameters).map(param => {
      const { color } = parameters[param];
      return {
        label: formatParameterName(param),
        data: dataPoints[param],
        borderColor: color,
        backgroundColor: `${color}20`,
        borderWidth: 2,
        tension: 0.4,
        fill: false,
        hidden: !['soil_moisture', 'soil_temperature', 'pH'].includes(param),
      };
    });

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart.Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              usePointStyle: true,
              padding: 15,
            },
          },
          tooltip: {
            backgroundColor: "rgba(17, 24, 39, 0.8)",
            titleColor: "#F3F4F6",
            bodyColor: "#F3F4F6",
            padding: 12,
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function (context) {
                const paramName = context.dataset.label.toLowerCase().replace(' ', '_');
                const value = context.raw.toFixed(1);
                const { min, max } = parameters[paramName.toLowerCase().replace(' ', '_')] || {};

                let status = "";
                if (min && max) {
                  if (context.raw < min) status = " (Low)";
                  else if (context.raw > max) status = " (High)";
                  else status = " (Optimal)";
                }

                return `${context.dataset.label}: ${value}${status}`;
              }
            }
          },
        },
        scales: {
          y: {
            grid: {
              color: "rgba(107, 114, 128, 0.1)",
            },
            ticks: {
              font: {
                size: 10,
              },
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
        interaction: {
          mode: 'index',
          intersect: false,
        },
        elements: {
          point: {
            radius: 2,
            hoverRadius: 5,
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [timelineView]);

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Sensor Data Timeline</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimelineView("weekly")}
            className={`px-4 py-2 text-sm rounded-lg transition ${timelineView === "weekly"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimelineView("monthly")}
            className={`px-4 py-2 text-sm rounded-lg transition ${timelineView === "monthly"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            Monthly
          </button>
        </div>
      </div>
      <div className="h-80">
        <canvas ref={chartRef}></canvas>
      </div>
      <div className="mt-4 text-sm text-gray-500 text-center">
        Toggle parameters visibility by clicking on their names in the legend below the chart
      </div>
    </div>
  );
};

const Graph = ({ title, data, min, max }) => {
  const latestValue = data[data.length - 1];
  let status = "optimal";
  let statusColor = "#10B981";

  if (latestValue < min) {
    status = "low";
    statusColor = "#F59E0B";
  } else if (latestValue > max) {
    status = "high";
    statusColor = "#EF4444";
  }

  const chartData = {
    labels: data.map((_, index) => `T-${data.length - index}`).reverse(),
    datasets: [
      {
        label: title,
        data: [...data].reverse(),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: "#3B82F6",
      },
      {
        label: "Min Range",
        data: Array(data.length).fill(min),
        borderColor: "#10B981",
        borderDash: [5, 5],
        borderWidth: 1,
        fill: false,
        pointRadius: 0,
      },
      {
        label: "Max Range",
        data: Array(data.length).fill(max),
        borderColor: "#EF4444",
        borderDash: [5, 5],
        borderWidth: 1,
        fill: false,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.8)",
        titleColor: "#F3F4F6",
        bodyColor: "#F3F4F6",
        padding: 12,
        borderColor: "rgba(107, 114, 128, 0.3)",
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        grid: {
          color: "rgba(107, 114, 128, 0.1)",
        },
        ticks: {
          font: {
            size: 10,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
          maxRotation: 0,
        },
      },
    },
  };

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden p-4 hover:shadow-xl transition duration-300">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <span className="text-2xl mr-2">{parameterIcons[title.toLowerCase().replace(' ', '_')] || '📊'}</span>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        <div className="flex items-center">
          <span className="font-bold text-xl mr-2">{latestValue.toFixed(1)}</span>
          <div className={`px-2 py-1 rounded-full text-xs font-medium`} style={{backgroundColor: statusColor, color: 'white'}}>
            {status.toUpperCase()}
          </div>
        </div>
      </div>
      <div className="h-48">
        <Line data={chartData} options={options} />
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <div>Min: <span className="font-medium text-green-600">{min}</span></div>
        <div>Optimal Range</div>
        <div>Max: <span className="font-medium text-red-600">{max}</span></div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [sensorData, setSensorData] = useState([]);
  const [certification, setCertification] = useState("");
  const [reason, setReason] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setRefreshing(true);
        const response = await axios.get(API_URL);
        setSensorData(response.data.sensor_history || []);
        setCertification(response.data.certification_status);
        setReason(response.data.certification_reason);
        setSuggestions(response.data.suggestions);
        setLoading(false);
        setTimeout(() => setRefreshing(false), 500);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
        setRefreshing(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
        <p className="mt-4 text-gray-600">Loading farm data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl mr-3">🌾</span>
            <h1 className="text-xl font-bold text-green-600">FarmData</h1>
          </div>
          <button 
            onClick={() => {
              setRefreshing(true);
              const fetchData = async () => {
                try {
                  const response = await axios.get(API_URL);
                  setSensorData(response.data.sensor_history || []);
                  setCertification(response.data.certification_status);
                  setReason(response.data.certification_reason);
                  setSuggestions(response.data.suggestions);
                  setTimeout(() => setRefreshing(false), 500);
                } catch (error) {
                  console.error("Error fetching data:", error);
                  setRefreshing(false);
                }
              };
              fetchData();
            }}
            className="bg-green-50 text-green-600 px-4 py-2 rounded-lg flex items-center hover:bg-green-100 transition"
          >
            <span className={`mr-2 ${refreshing ? 'animate-spin' : ''}`}>↻</span>
            Refresh
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <CertificationProgressBar certification={certification} />
          </div>
          <div className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col justify-center p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Certification Details</h3>
            <p className="text-gray-600">{reason}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {sensorData.length > 0 &&
            Object.keys(standardRanges).map((key) => (
              <Graph
                key={key}
                title={formatParameterName(key)}
                data={sensorData.map((d) => d[key])}
                min={standardRanges[key].min}
                max={standardRanges[key].max}
              />
            ))}
        </div>

        <div className="mt-8">
          <TimelineGraph />
        </div>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">💡</span>
              <h2 className="text-2xl font-bold text-gray-800">AI Recommendations</h2>
            </div>
            {suggestions.length > 0 ? (
              <div className="space-y-4">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start p-4 bg-green-50 rounded-lg">
                    <div className="text-green-600 mr-3 mt-1">•</div>
                    <p className="text-gray-700">{suggestion}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <span className="text-4xl mb-3 block">✅</span>
                <p className="text-lg font-medium text-green-700">All systems optimal! Your farm is performing excellently.</p>
              </div>
            )}
          </div>
        </div>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>Data refreshes automatically every 10 seconds • Last updated {new Date().toLocaleTimeString()}</p>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;