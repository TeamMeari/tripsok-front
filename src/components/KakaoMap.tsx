import { useEffect, useRef } from "react";

interface Location {
    lat: number;
    lng: number;
    title: string;
}

//지도 사이즈 입력 받음
interface KakaoMapProps {
    width?: string;
    height?: string;
    locations?: Location[];
}

const DEFAULT_LOCATION: Location[] = [
    { title: "강릉", lat: 37.751, lng: 128.876 },
];

const KAKAO_MAP_KEY = import.meta.env.VITE_KAKAOMAP_KEY;

const KakaoMap: React.FC<KakaoMapProps> = ({
                                               width = "100%",
                                               height = "120px",
                                               locations = DEFAULT_LOCATION,
                                           }) => {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&autoload=false`;
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            const kakao = (window as any).kakao;
            if (!kakao || !mapRef.current) return;

            kakao.maps.load(() => {
                const map = new kakao.maps.Map(mapRef.current, {
                    center: new kakao.maps.LatLng(locations[0].lat, locations[0].lng),
                    level: 4,
                    // mapTypeId: kakao.maps.MapTypeId.SKYVIEW,
                });

                const bounds = new kakao.maps.LatLngBounds();

                locations.forEach((loc) => {
                    const marker = new kakao.maps.Marker({
                        position: new kakao.maps.LatLng(loc.lat, loc.lng),
                        map,
                        title: loc.title,
                    });

                    const infowindow = new kakao.maps.InfoWindow({
                        content: `<div style="padding:5px;">${loc.title}</div>`,
                    });

                    kakao.maps.event.addListener(marker, "click", () => {
                        infowindow.open(map, marker);
                    });

                    bounds.extend(marker.getPosition());
                });

                map.setBounds(bounds);
            });
        };

        return () => {
            document.head.removeChild(script);
        };
    }, [locations]);

    return <div ref={mapRef} style={{ width, height }} />;
};

export default KakaoMap;
