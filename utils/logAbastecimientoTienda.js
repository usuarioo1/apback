const lineaAbastecimientoTienda = (item) => {
    const codigo = item?.codigo ?? 'sin código';
    const transferido = item?.transferido ?? 'N/A';
    const bodegaAnterior = item?.stockBodegaAnterior ?? 'N/A';
    const bodegaActual = item?.stockBodegaActual ?? 'N/A';
    const tiendaAnterior = item?.stockTiendaAnterior ?? 'N/A';
    const tiendaActual = item?.stockTiendaActual ?? 'N/A';
    return `Código: ${codigo} | Transferido: ${transferido} | Bodega: ${bodegaAnterior} → ${bodegaActual} | Tienda: ${tiendaAnterior} → ${tiendaActual}`;
};

const logAbastecimientoTienda = (item) => {
    console.log(`[ABASTECIMIENTO TIENDA] ${lineaAbastecimientoTienda(item)}`);
};

const logResumenAbastecimientoTienda = (titulo, items) => {
    const fecha = new Date().toISOString();
    console.log(`========== RESUMEN ABASTECIMIENTO DE TIENDA - ${fecha}${titulo ? ` - ${titulo}` : ''} ==========`);

    if (!Array.isArray(items) || items.length === 0) {
        console.log('  No se abasteció stock de ningún producto a tienda');
    } else {
        for (const item of items) {
            console.log(`  ${lineaAbastecimientoTienda(item)}`);
        }
        console.log(`  Total de items abastecidos: ${items.length}`);
    }

    console.log('='.repeat(60));
};

module.exports = { logAbastecimientoTienda, logResumenAbastecimientoTienda };
