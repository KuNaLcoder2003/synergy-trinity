import { useEffect, useState } from "react";

type Country = {
    flag: string,
    name: string
}
const useCountries = () => {
    const [countries, setCountries] = useState<Country[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    async function getCountries() {
        setLoading(true)
        const response = await fetch("https://restcountries.com/v3.1/all?fields=name,flags");
        const data: any = await response.json();
        const countries: Country[] = data.map((obj: any) => {
            return {
                flag: obj.flags.png,
                name: obj.name.official
            }
        })
        setCountries(countries)
        setLoading(false)
    }
    useEffect(() => {
        getCountries()
    }, [])

    return { countries, loading }
}

export default useCountries;