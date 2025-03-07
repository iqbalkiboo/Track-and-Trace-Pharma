export const setAddress = (address: any) => {
    if (address) {
        const detail = address.detail
        const urban_village = address.urban_village?.name
        const sub_district = address.sub_district?.name
        const district = address.district?.name
        const province = address.province?.name

        return `${detail}, ${urban_village}, ${sub_district}, ${district}, ${province}`
    }
}
