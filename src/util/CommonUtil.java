package util;

import bean.Cell;
import bean.GPS;

import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;

/**
 * Common utility
 *
 * @author Bin Cheng
 */
public class CommonUtil {

    /**
     * Generate the UUID without '-'
     *
     * @return UUID
     */
    public static String getUUID() {
        String s = UUID.randomUUID().toString();
        return s.substring(0, 8) + s.substring(9, 13) + s.substring(14, 18) + s.substring(19, 23) + s.substring(24);
    }

    /**
     * @return unit:m
     */
    public static double distanceBetween(GPS GPS1, GPS GPS2) {
        return computeDistance(GPS1.getLatitude(), GPS1.getLongitude(), GPS2.getLatitude(), GPS2.getLongitude());
    }

    /**
     * @return the distance of trajectory
     */
    public static double trajectoryDistance(List<GPS> trajectory) {
        if (trajectory.size() <= 1)
            return 0;

        double distance = 0.0;
        GPS lastGPS = trajectory.get(0);
        GPS currentGPS;
        for (int i = 1; i < trajectory.size(); i++) {
            currentGPS = trajectory.get(i);
            distance += distanceBetween(lastGPS, currentGPS);
            lastGPS = currentGPS;
        }
        return distance;
    }

    /**
     * Compute the distance between (lat1,lon1) and (lat2,lon2).
     * Copy from the method of Location.distanceBetween in Android.
     */
    private static double computeDistance(double lat1, double lon1,
                                          double lat2, double lon2) {
        // Based on http://www.ngs.noaa.gov/PUBS_LIB/inverse.pdf
        // using the "Inverse Formula" (section 4)

        int MAXITERS = 20;
        // Convert lat/long to radians
        lat1 *= Math.PI / 180.0;
        lat2 *= Math.PI / 180.0;
        lon1 *= Math.PI / 180.0;
        lon2 *= Math.PI / 180.0;

        double a = 6378137.0; // WGS84 major axis
        double b = 6356752.3142; // WGS84 semi-major axis
        double f = (a - b) / a;
        double aSqMinusBSqOverBSq = (a * a - b * b) / (b * b);

        double L = lon2 - lon1;
        double A = 0.0;
        double U1 = Math.atan((1.0 - f) * Math.tan(lat1));
        double U2 = Math.atan((1.0 - f) * Math.tan(lat2));

        double cosU1 = Math.cos(U1);
        double cosU2 = Math.cos(U2);
        double sinU1 = Math.sin(U1);
        double sinU2 = Math.sin(U2);
        double cosU1cosU2 = cosU1 * cosU2;
        double sinU1sinU2 = sinU1 * sinU2;

        double sigma = 0.0;
        double deltaSigma = 0.0;
        double cosSqAlpha = 0.0;
        double cos2SM = 0.0;
        double cosSigma = 0.0;
        double sinSigma = 0.0;
        double cosLambda = 0.0;
        double sinLambda = 0.0;

        double lambda = L; // initial guess
        for (int iter = 0; iter < MAXITERS; iter++) {
            double lambdaOrig = lambda;
            cosLambda = Math.cos(lambda);
            sinLambda = Math.sin(lambda);
            double t1 = cosU2 * sinLambda;
            double t2 = cosU1 * sinU2 - sinU1 * cosU2 * cosLambda;
            double sinSqSigma = t1 * t1 + t2 * t2; // (14)
            sinSigma = Math.sqrt(sinSqSigma);
            cosSigma = sinU1sinU2 + cosU1cosU2 * cosLambda; // (15)
            sigma = Math.atan2(sinSigma, cosSigma); // (16)
            double sinAlpha = (sinSigma == 0) ? 0.0 :
                    cosU1cosU2 * sinLambda / sinSigma; // (17)
            cosSqAlpha = 1.0 - sinAlpha * sinAlpha;
            cos2SM = (cosSqAlpha == 0) ? 0.0 :
                    cosSigma - 2.0 * sinU1sinU2 / cosSqAlpha; // (18)

            double uSquared = cosSqAlpha * aSqMinusBSqOverBSq; // defn
            A = 1 + (uSquared / 16384.0) * // (3)
                    (4096.0 + uSquared *
                            (-768 + uSquared * (320.0 - 175.0 * uSquared)));
            double B = (uSquared / 1024.0) * // (4)
                    (256.0 + uSquared *
                            (-128.0 + uSquared * (74.0 - 47.0 * uSquared)));
            double C = (f / 16.0) *
                    cosSqAlpha *
                    (4.0 + f * (4.0 - 3.0 * cosSqAlpha)); // (10)
            double cos2SMSq = cos2SM * cos2SM;
            deltaSigma = B * sinSigma * // (6)
                    (cos2SM + (B / 4.0) *
                            (cosSigma * (-1.0 + 2.0 * cos2SMSq) -
                                    (B / 6.0) * cos2SM *
                                            (-3.0 + 4.0 * sinSigma * sinSigma) *
                                            (-3.0 + 4.0 * cos2SMSq)));

            lambda = L +
                    (1.0 - C) * f * sinAlpha *
                            (sigma + C * sinSigma *
                                    (cos2SM + C * cosSigma *
                                            (-1.0 + 2.0 * cos2SM * cos2SM))); // (11)

            double delta = (lambda - lambdaOrig) / lambda;
            if (Math.abs(delta) < 1.0e-12) {
                break;
            }
        }

        return (b * A * (sigma - deltaSigma));
    }

    /**
     * Check if <b>timestamp</b> is the form of yyyy-MM-dd HH:mm:ss
     *
     * @param timestamp the timestamp which need to check
     * @return <b>true</b> the timestamp is valid, <b>false</b> the timestamp is invalid.
     */
    public static boolean isValidTimestamp(String timestamp) {
        return Pattern.compile("\\w{4}-\\w{2}-\\w{2} \\w{2}:\\w{2}:\\w{2}").matcher(timestamp).matches();
    }

    public static List<Cell> removeExtraCell(List<Cell> testTrajectory, Cell startPoint, Cell endPoint) {
        int startIndex = 0;
        int endIndex = 0;
        for (int i = 0; i < testTrajectory.size(); i++) {
            if (testTrajectory.get(i).equals(startPoint))
                startIndex = i;
            else if (testTrajectory.get(i).equals(endPoint))
                endIndex = i;
        }
        try {
            return testTrajectory.subList(startIndex, endIndex + 1);
        } catch (Exception e) {
            return null;
        }
    }

    public static List<GPS> removeExtraGPS(List<GPS> gpsTrajectory, Cell start, Cell end) {
        int startIndex = 0;
        int endIndex = 0;
        for (int i = 0; i < gpsTrajectory.size(); i++) {
            if (TileSystem.GPSToTile(gpsTrajectory.get(i)).equals(start))
                startIndex = i;
            else if (TileSystem.GPSToTile(gpsTrajectory.get(i)).equals(end))
                endIndex = i;
        }
        try {
            return gpsTrajectory.subList(startIndex, endIndex);
        } catch (Exception e) {
            return null;
        }

    }

}
