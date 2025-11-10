/* Replace with your SQL commands */

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

  -- Nhiều điểm => tạo bounding circle thật
  UPDATE clusters
  SET area_geom = (
    SELECT ST_MinimumBoundingCircle(ST_Collect(d.geom))
    FROM devices d
    WHERE d.cluster_id = cid
      AND d.geom IS NOT NULL
  )
  WHERE id = cid;
END;
$$ LANGUAGE plpgsql;
