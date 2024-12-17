<template>
    <div>
        <div class='dashboard-header'>
            <p class='title'>
                Dashboard
            </p>
            <div class='dash-header-actions'>
                <a-button>Export</a-button>
            </div>
        </div>
        <div class='dash-statistics'>
            <div class='dash-card'>
                <p class='dash-card-header'>Total incomes</p>
                <p class='dash-card-body'>$2000</p>
                <p class='dash-card-footer'>Target $4800</p>
            </div>
            <div class='dash-card'>
                <p class='dash-card-header'>Total Expenses</p>
                <p class='dash-card-body'>$3000</p>
                <p class='dash-card-footer'>Target $2000</p>
            </div>
            <div class='dash-card'>
                <p class='dash-card-header'>Total Transactions</p>
                <p class='dash-card-body'>86</p>
                <p class='dash-card-footer'>Target $2000</p>
            </div>
            <div class='dash-card'>
                <p class='dash-card-header'>Farmers with Insurance</p>
                <p class='dash-card-body'>70%</p>
                <p class='dash-card-footer'>Target 80%</p>
            </div>
        </div>
        <div class='dash-statistics'>
            <div class='dash-card'>
                <p class='dash-card-header'>
                    <img src="./../assets/icon-1.svg" class="" alt="Veternaries" />
                </p>
                <p class='dash-card-footer'>Veternaries</p>
                <p class='dash-card-body'>247</p>
            </div>
            <div class='dash-card'>
                <p class='dash-card-header'>
                    <img src="./../assets/icon-3.svg" class="" alt="Farmers" />
                </p>
                <p class='dash-card-footer'>Farmers</p>
                <p class='dash-card-body'>123</p>
            </div>
            <div class='dash-card'>
                <p class='dash-card-header'>
                    <img src="./../assets/icon-2.svg" class="" alt="Suppliers" />

                </p>
                <p class='dash-card-footer'>Suppliers</p>
                <p class='dash-card-body'>36</p>
            </div>
            <div class='dash-card'>
                <p class='dash-card-header'>
                    <img src="./../assets/icon-4.svg" class="" alt="Appointments" />
                </p>
                <p class='dash-card-footer'>Appointments</p>
                <p class='dash-card-body'>10</p>
            </div>
            <div class='dash-card'>
                <p class='dash-card-header'>
                    <img src="./../assets/icon-5.svg" class="" alt="onboarding" />
                </p>
                <p class='dash-card-footer'>Onboarding</p>
                <p class='dash-card-body'>46</p>
            </div>

        </div>
        <div class='dash-graphs'>
            <div class="dash-pie">
                <dashboard-pie></dashboard-pie>
            </div>
            <div class="dash-histogram">
                demography
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.dashboard-header {
    padding-block: 1em;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.title {
    font-size: 1.35em;
    font-weight: 600;

}

.dash-statistics,
.dash-graphs {
    display: flex;
    width: 100%;
    gap: 1.45em;
    flex-flow: wrap;
    margin-bottom: 1.75em;

}

.dash-card {
    flex-grow: 1;
    background: white;
    padding: 0.5em;
    border-radius: 0.5rem;
}

.dash-card-body {
    font-size: 1.5em;
    padding: 0em;
    margin: 0em;
    font-weight: 500;
    padding-block: 0.15em;
}

.dash-card-header,
.dash-card-footer {
    margin: 0em;
    font-size: 0.875rem;
    color: #2d2d2d
}

.dash-card-header {
    padding: 3px;
    borded-radius: 50%;
}

.dash-card-footer {
    padding-block: 0.15em;
}

.dash-pie,
.dash-histogram {
    flex-grow: 1;
    background-color: white;
}
</style>