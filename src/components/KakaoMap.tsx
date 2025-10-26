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
    const mapInstance = useRef<any>(null);       // 지도 객체
    const markersRef = useRef<any[]>([]);        // 마커 객체들

    useEffect(() => {
        const script = document.createElement("script");
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&autoload=false`;
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            const kakao = (window as any).kakao;
            if (!kakao || !mapRef.current) return;

            kakao.maps.load(() => {
                // map이 없으면 생성
                if (!mapInstance.current) {
                    mapInstance.current = new kakao.maps.Map(mapRef.current, {
                        center: new kakao.maps.LatLng(locations[0].lat, locations[0].lng),
                        level: 4,
                    });
                }

                // 기존 마커 제거
                markersRef.current.forEach(marker => marker.setMap(null));
                markersRef.current = [];

                const bounds = new kakao.maps.LatLngBounds();

                // 새로운 마커 생성
                locations.forEach((loc) => {
                    const marker = new kakao.maps.Marker({
                        position: new kakao.maps.LatLng(loc.lat, loc.lng),
                        map: mapInstance.current,
                        title: loc.title,
                    });

                    const infowindow = new kakao.maps.InfoWindow({
                        content: `<div style="padding:5px;">${loc.title}</div>`,
                    });

                    kakao.maps.event.addListener(marker, "click", () => {
                        infowindow.open(mapInstance.current, marker);
                    });

                    markersRef.current.push(marker);
                    bounds.extend(marker.getPosition());
                });

                // 모든 마커가 보이도록 지도 영역 설정
                if (locations.length > 0) {
                    mapInstance.current.setBounds(bounds);
                }
            });
        };

        return () => {
            document.head.removeChild(script);
        };
    }, [locations]);

    return <div ref={mapRef} style={{ width, height }} />;
};

export default KakaoMap;
