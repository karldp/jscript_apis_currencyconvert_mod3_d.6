const form = document.getElementById("calculator");
const chart = document.getElementById("myChart");
let myChart;


//this is to get the currency data

const getCurrency = async (currency) => {
    try {
        const values = await fetch(`https://mindicador.cl/api/${currency}`);
        const results = await values.json();
        return results.serie;
    } catch (error) {
        alert(error.message);
    }
};


// Currency conversion calculation

const calculateCurrencyTotal = (values, data) => {
    const currencyValue = data[0].valor;
    const total = values / currencyValue;
    return Math.round(total * 100) / 100; //to avoid decimals
};

// Show total on screen
const showTotal = (total) => {
    document.getElementById("total-value").innerHTML = "$" + total;
};


// getting currency values
const getCurrencyValues = (data) => {
    return data.map((item) => item.valor);
};



// Getting the dates (check after)
const getDates = (data) => {
    return data.map((item) => new Date(item.fecha).toLocaleDateString("en-US"));
};



// Dlete previous chart so the new one can be seen
const deletePreviousChart = () => {
    if (myChart) {
        myChart.destroy(); // "destroy" is part of the library
    }
};


// Calculate the currency value 
const calculateCurrencyValue = async (valor, currency) => {
    const data = await getCurrency(currency);
    showChart(data, valor);
};


// Show chart function
const showChart = (data, valor) => {
    const total = calculateCurrencyTotal(valor, data);
    showTotal(total);

    const labels = getDates(data); // get dates
    const values = getCurrencyValues(data); // get currency values

    const datasets = [
        {
            label: "CURRENCY",
            borderColor: "rgb(42, 37, 73)",
            data: values,
        },
    ];

    const config = {
        type: "line",
        data: {labels, datasets},
    };

    deletePreviousChart();

    chart.style.backgroundColor = "rgb(149, 143, 185)";
    chart.style.borderRadius = "10px";

    myChart = new Chart(chart, config); // to create new chart
};


// To send the info of form
form.addEventListener("submit", async (event) => {
    event.preventDefault(); // just in case you use form

    const value = form.elements["value"].value; // input
    const currency = form.elements["currency"].value; // select

    if (!value) {
        alert("Please insert value");
        return;
    }
    if (!currency) {
        alert("Please select currency");
        return;
    }

    await calculateCurrencyValue(value, currency);
});
