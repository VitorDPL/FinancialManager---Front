<template>
    <div class="nav-container">
        <nav>
            <ul>
                <Router-Link to="/">
                    <li>Home</li>
                </Router-Link>
                <Router-Link to="categorias">
                    <li>Categorias</li>
                </Router-Link>
            </ul>
        </nav>
    </div>
</template>

<script>
</script>

<style scoped>
nav ul {
    display: flex;
    gap: 1rem;
}
</style>    