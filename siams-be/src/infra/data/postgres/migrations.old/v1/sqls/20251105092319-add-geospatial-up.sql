/* Replace with your SQL commands */

CREATE EXTENSION IF NOT EXISTS postgis;

/* add location based data to devices */
ALTER TABLE devices
ADD COLUMN IF NOT EXISTS geom geometry(Point, 4326);

CREATE INDEX IF NOT EXISTS idx_devices_geom ON devices USING GIST (geom);

ALTER TABLE clusters
ADD COLUMN IF NOT EXISTS area_geom geometry(Polygon, 4326);

/* Function cập nhật vị trí của cluster khi device's geometry thay đổi */
CREATE OR REPLACE FUNCTION update_cluster_area(cid UUID)
RETURNS VOID AS $$
DECLARE
  geom_count INTEGER;
BEGIN
  -- Đếm số lượng điểm hợp lệ trong cluster
  SELECT COUNT(d.geom)
  INTO geom_count
  FROM devices d
  WHERE d.cluster_id = cid
    AND d.geom IS NOT NULL;

  -- Nếu không có điểm nào => area_geom = NULL
  IF geom_count = 0 THEN
    UPDATE clusters SET area_geom = NULL WHERE id = cid;
    RETURN;
  END IF;

  -- Nếu chỉ có 1 điểm => tạo vòng tròn nhỏ (buffer)
  IF geom_count = 1 THEN
    UPDATE clusters
    SET area_geom = (
      SELECT ST_SetSRID(ST_Buffer(d.geom::geography, 1)::geometry, 4326)
      FROM devices d
      WHERE d.cluster_id = cid
        AND d.geom IS NOT NULL
      LIMIT 1
    )
    WHERE id = cid;
  ELSE
    -- Nhiều điểm => tạo bounding circle thật
    UPDATE clusters
    SET area_geom = (
      SELECT ST_MinimumBoundingCircle(ST_Collect(d.geom))
      FROM devices d
      WHERE d.cluster_id = cid
        AND d.geom IS NOT NULL
    )
    WHERE id = cid;
  END IF;
END;
$$ LANGUAGE plpgsql;
