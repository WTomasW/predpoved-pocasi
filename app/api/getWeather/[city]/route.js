import { NextResponse } from 'next/server';

export async function GET(req, { params }) {

    const city = params.city;

    if (!city) {
        return NextResponse.json({ error: 'Potřebuješ město' }, { status: 400 });
    }

    try {

        const url = `https://weatherapi-com.p.rapidapi.com/current.json?q=${city}`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': process.env.WEATHER_API,
                'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
            }
        };

        const res = await fetch(url, options);
        const data = await res.json();

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }

}
