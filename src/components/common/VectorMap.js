import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import jsVectorMap from "jsvectormap";
if (typeof window !== "undefined") {
    window.jsVectorMap =
        jsVectorMap;
}
import "jsvectormap/dist/maps/world.js";
export function VectorMap({ map = "world", containerStyle, containerClassName, backgroundColor = "transparent", zoomOnScroll = false, zoomOnScrollSpeed, zoomMax = 12, zoomMin = 1, zoomAnimate = true, zoomStep = 1.5, zoomButtons = false, markers, markerStyle, markersSelectable, markersSelectableOne, selectedMarkers, regionStyle, regionLabelStyle, regionsSelectable, regionsSelectableOne, selectedRegions, labels, lines, lineStyle, series, visualizeData, focusOn, onLoaded, onRegionClick, onMarkerClick, onRegionSelected, onMarkerSelected, onRegionTipShow, onMarkerTipShow, onRegionTooltipShow, onMarkerTooltipShow, onViewportChange, onDestroyed, mapRef, style, className, }) {
    const ref = useRef(null);
    useEffect(() => {
        const node = ref.current;
        if (!node)
            return;
        node.innerHTML = "";
        let mapName = "world";
        if (typeof map === "string") {
            if (map === "world" || map === "worldMill" || map === "worldMerc") {
                mapName = "world";
            }
            else if (map === "usAea" || map === "us_aea" || map === "us_aea_en") {
                mapName = "us_aea_en";
            }
            else {
                mapName = map;
            }
        }
        else if (map && typeof map === "object") {
            const mapObj = map;
            if (mapObj.name) {
                mapName = mapObj.name;
                if (!jsVectorMap
                    .maps?.[mapName]) {
                    jsVectorMap.addMap(mapName, map);
                }
            }
        }
        const normalizedMarkers = markers?.map((marker) => {
            const coords = marker.coords || marker.latLng || [0, 0];
            let itemStyle = marker.style;
            if (itemStyle && typeof itemStyle === "object" && !("initial" in itemStyle)) {
                const { borderWidth, borderColor, ...rest } = itemStyle;
                itemStyle = {
                    initial: {
                        ...rest,
                        ...(borderWidth !== undefined ? { strokeWidth: borderWidth } : {}),
                        ...(borderColor !== undefined ? { stroke: borderColor } : {}),
                    },
                };
            }
            return {
                ...marker,
                coords,
                style: itemStyle,
            };
        });
        let mapInstance = null;
        try {
            mapInstance = new jsVectorMap({
                selector: node,
                map: mapName,
                backgroundColor,
                draggable: true,
                zoomButtons,
                zoomOnScroll,
                ...(zoomOnScrollSpeed !== undefined ? { zoomOnScrollSpeed } : {}),
                zoomMax,
                zoomMin,
                zoomAnimate,
                zoomStep,
                ...(markers ? { markers: normalizedMarkers } : {}),
                ...(markerStyle ? { markerStyle: markerStyle } : {}),
                markersSelectable: markersSelectable ?? Boolean(selectedMarkers && selectedMarkers.length > 0),
                ...(markersSelectableOne !== undefined ? { markersSelectableOne } : {}),
                ...(selectedMarkers ? { selectedMarkers } : {}),
                ...(regionStyle ? { regionStyle: regionStyle } : {}),
                ...(regionLabelStyle ? { regionLabelStyle: regionLabelStyle } : {}),
                regionsSelectable: regionsSelectable ?? Boolean(selectedRegions && selectedRegions.length > 0),
                ...(regionsSelectableOne !== undefined ? { regionsSelectableOne } : {}),
                ...(selectedRegions ? { selectedRegions } : {}),
                ...(labels ? { labels: labels } : {}),
                ...(lines ? { lines: lines } : {}),
                ...(lineStyle ? { lineStyle: lineStyle } : {}),
                ...(series ? { series: series } : {}),
                ...(visualizeData ? { visualizeData: visualizeData } : {}),
                ...(focusOn ? { focusOn: focusOn } : {}),
                ...(onLoaded ? { onLoaded } : {}),
                ...(onRegionClick ? { onRegionClick } : {}),
                ...(onMarkerClick ? { onMarkerClick } : {}),
                ...(onRegionSelected ? { onRegionSelected } : {}),
                ...(onMarkerSelected ? { onMarkerSelected } : {}),
                ...(onRegionTooltipShow
                    ? { onRegionTooltipShow }
                    : onRegionTipShow
                        ? {
                            onRegionTooltipShow: (event, tooltip, code) => onRegionTipShow(event, tooltip, code),
                        }
                        : {}),
                ...(onMarkerTooltipShow
                    ? { onMarkerTooltipShow }
                    : onMarkerTipShow
                        ? {
                            onMarkerTooltipShow: (event, tooltip, index) => onMarkerTipShow(event, tooltip, Number(index)),
                        }
                        : {}),
                ...(onViewportChange ? { onViewportChange } : {}),
                ...(onDestroyed ? { onDestroyed } : {}),
            });
            // Compatibility helpers for custom zoom buttons
            if (typeof mapInstance.setScale !== "function") {
                mapInstance.setScale = function (scale, anchorX, anchorY, isCentered, animate) {
                    if (typeof this._setScale === "function") {
                        this._setScale(scale, anchorX, anchorY, isCentered, animate);
                    }
                };
            }
            if (!Object.prototype.hasOwnProperty.call(mapInstance, "width")) {
                Object.defineProperty(mapInstance, "width", {
                    get() {
                        return this._width ?? node?.clientWidth ?? 0;
                    },
                    configurable: true,
                });
            }
            if (!Object.prototype.hasOwnProperty.call(mapInstance, "height")) {
                Object.defineProperty(mapInstance, "height", {
                    get() {
                        return this._height ?? node?.clientHeight ?? 0;
                    },
                    configurable: true,
                });
            }
            if (mapRef) {
                mapRef.current = mapInstance;
            }
        }
        catch (err) {
            console.error("Failed to initialize jsVectorMap:", err);
        }
        return () => {
            if (mapRef) {
                mapRef.current = null;
            }
            if (mapInstance) {
                try {
                    mapInstance.destroy();
                }
                catch {
                    // ignore
                }
            }
            if (node) {
                node.innerHTML = "";
            }
        };
    }, [
        map,
        backgroundColor,
        zoomOnScroll,
        zoomOnScrollSpeed,
        zoomMax,
        zoomMin,
        zoomAnimate,
        zoomStep,
        zoomButtons,
        markers,
        markerStyle,
        markersSelectable,
        markersSelectableOne,
        selectedMarkers,
        regionStyle,
        regionLabelStyle,
        regionsSelectable,
        regionsSelectableOne,
        selectedRegions,
        labels,
        lines,
        lineStyle,
        series,
        visualizeData,
        focusOn,
        onLoaded,
        onRegionClick,
        onMarkerClick,
        onRegionSelected,
        onMarkerSelected,
        onRegionTipShow,
        onMarkerTipShow,
        onRegionTooltipShow,
        onMarkerTooltipShow,
        onViewportChange,
        onDestroyed,
        mapRef,
    ]);
    const combinedClassName = [containerClassName, className]
        .filter(Boolean)
        .join(" ");
    return (_jsx("div", { ref: ref, className: combinedClassName || undefined, style: { width: "100%", height: "100%", ...containerStyle, ...style } }));
}
export default VectorMap;
