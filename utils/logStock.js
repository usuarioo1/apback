const lineaDescuentoStock = (item) => {
    const codigo = item?.codigo ?? 'sin código';
    const stockAnterior = item?.stockAnterior ?? 'N/A';
    const descontado = item?.descontado ?? 'N/A';
    const restante = item?.restante ?? 'N/A';
    return `Código: ${codigo} | Stock anterior: ${stockAnterior} | Descontado: ${descontado} | Stock restante: ${restante}`;
};

const logDescuentoStock = (item) => {
    console.log(`[DESCUENTO STOCK] ${lineaDescuentoStock(item)}`);
};

const logResumenDescuentoStock = (titulo, items) => {
    const fecha = new Date().toISOString();
    console.log(`========== RESUMEN DESCUENTO DE STOCK - ${fecha}${titulo ? ` - ${titulo}` : ''} ==========`);

    if (!Array.isArray(items) || items.length === 0) {
        console.log('  No se descontó stock de ningún producto');
    } else {
        for (const item of items) {
            console.log(`  ${lineaDescuentoStock(item)}`);
        }
        console.log(`  Total de items descontados: ${items.length}`);
    }

    console.log('='.repeat(60));
};

module.exports = { logDescuentoStock, logResumenDescuentoStock };
