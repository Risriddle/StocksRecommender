// import React from 'react';

// const MetricsSection = () => {
//   const metrics = [
//     { label: 'Avg Week Return', value: '1.88%' },
//     { label: 'Avg 1 Month Return', value: '4.98%' },
//     { label: 'Avg 3 Month Return', value: '9.94%' },
//     { label: 'Avg Return Since Added', value: '24.80%' },
//     { label: 'Avg Return Since Buy', value: '28.01%' },
//     { label: 'Avg Required Return', value: '20.42%' },
//   ];

//   return (
//     <div className="mb-6">
//       <h1 className="text-2xl font-bold mb-4">Stock Dashboard</h1>
//       <div className="grid grid-cols-6 gap-4">
//         {metrics.map((metric) => (
//           <div key={metric.label} className="bg-white p-4 rounded-lg shadow">
//             <p className="text-sm text-gray-600">{metric.label}</p>
//             <p className="text-xl font-semibold text-green-500">{metric.value}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MetricsSection;






// import React, { useEffect, useState } from "react";

// const MetricsSection = () => {
//   const [portfolios, setPortfolios] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchPortfolios = async () => {
//       try {
//         const response = await fetch("/api/admin/portfolios");
//         const data = await response.json();
//         setPortfolios(data);
//       } catch (error) {
//         console.error("Error fetching portfolios:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPortfolios();
//   }, []);

//   const calculateMetrics = (portfolio) => {
//     // Dummy calculations - Replace these with actual portfolio data calculations
//     return {
//       "Avg Week Return": "1.88%",
//       "Avg 1 Month Return": "4.98%",
//       "Avg 3 Month Return": "9.94%",
//       "Avg Return Since Added": "24.80%",
//       "Avg Return Since Buy": "28.01%",
//       "Avg Required Return": "20.42%",
//     };
//   };

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div className="mb-6">
//       <h1 className="text-2xl font-bold mb-4">Stock Dashboard</h1>
//       {portfolios.length === 0 ? (
//         <p>No admin-created portfolios found.</p>
//       ) : (
//         portfolios.map((portfolio) => {
//           const metrics = calculateMetrics(portfolio);
//           return (
//             <div key={portfolio._id} className="mb-6 p-4 border rounded-lg shadow">
//               <h2 className="text-xl font-semibold mb-2">{portfolio.name}</h2>
//               <div className="grid grid-cols-3 gap-4">
//                 {Object.entries(metrics).map(([label, value]) => (
//                   <div key={label} className="bg-white p-4 rounded-lg shadow">
//                     <p className="text-sm text-gray-600">{label}</p>
//                     <p className="text-xl font-semibold text-green-500">{value}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           );
//         })
//       )}
//     </div>
//   );
// };

// export default MetricsSection;








import React, { useEffect, useState } from "react";

const MetricsSection = () => {
  const [portfolios, setPortfolios] = useState([]);

  useEffect(() => {
    const fetchAdminPortfolios = async () => {
      try {
        const response = await fetch("/api/admin/portfolios/metrics");
        const data = await response.json();
        console.log(data,"portfolio metricssssssssss")
        if (response.ok) {
          setPortfolios(data);
        } else {
          console.error("Error fetching portfolios:", data.message);
        }
      } catch (error) {
        console.error("Error fetching admin portfolios:", error);
      }
    };

    fetchAdminPortfolios();
  }, []);

  // Function to calculate metrics
  const calculateMetrics = (portfolio) => {
    const { currentValue, valueOneWeekAgo, valueOneMonthAgo, valueThreeMonthsAgo, initialValue, buyPrice, requiredReturn } = portfolio;

    return {
      avgWeekReturn: valueOneWeekAgo ? ((currentValue - valueOneWeekAgo) / valueOneWeekAgo * 100).toFixed(2) + "%" : "N/A",
      avg1MonthReturn: valueOneMonthAgo ? ((currentValue - valueOneMonthAgo) / valueOneMonthAgo * 100).toFixed(2) + "%" : "N/A",
      avg3MonthReturn: valueThreeMonthsAgo ? ((currentValue - valueThreeMonthsAgo) / valueThreeMonthsAgo * 100).toFixed(2) + "%" : "N/A",
      avgReturnSinceAdded: initialValue ? ((currentValue - initialValue) / initialValue * 100).toFixed(2) + "%" : "N/A",
      avgReturnSinceBuy: buyPrice ? ((currentValue - buyPrice) / buyPrice * 100).toFixed(2) + "%" : "N/A",
      avgRequiredReturn: requiredReturn ? requiredReturn.toFixed(2) + "%" : "N/A",
    };
  };

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold mb-4">Stock Dashboard</h1>
      {portfolios.length === 0 ? (
        <p>No admin portfolios available.</p>
      ) : (
        portfolios.map((portfolio) => {
          const metrics = calculateMetrics(portfolio);
          return (
            <div key={portfolio._id} className="mb-6">
              <h2 className="text-xl font-semibold mb-2">{portfolio.portfolioName}</h2>
              <div className="grid grid-cols-6 gap-4">
              {Object.entries(metrics).map(([label, value], index) => (
  <div key={`${label}`} className="bg-white p-4 rounded-lg shadow">
    <p className="text-sm text-gray-600">{label.replace(/([A-Z])/g, " $1")}</p>
    <p className="text-xl font-semibold text-green-500">{value}</p>
  </div>
))}

              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MetricsSection;
