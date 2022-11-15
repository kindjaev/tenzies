
function getTime(timer){
    const getSec = `0${Math.floor(timer % 60)}`.slice(-2)
    const min = Math.floor(timer / 60)
    const getMin = `0${Math.floor(min % 60)}`.slice(-2)
    const getHour = `0${Math.floor(timer / 3600)}`.slice(-2) 
    return `${getHour}:${getMin}:${getSec}`
};
export default getTime