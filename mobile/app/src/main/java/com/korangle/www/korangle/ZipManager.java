package com.korangle.www.korangle;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;
import android.util.Log;

public class ZipManager {
    private static final int BUFFER = 80000;

    public void zip(String[] _files, String zipFileName) {
        try {
            BufferedInputStream origin = null;
            FileOutputStream dest = new FileOutputStream(zipFileName);
            ZipOutputStream out = new ZipOutputStream(new BufferedOutputStream(
                    dest));
            byte data[] = new byte[BUFFER];

            for (int i = 0; i < _files.length; i++) {
                // Log.v("Compress", "Adding: " + _files[i]);
                FileInputStream fi = new FileInputStream(_files[i]);
                origin = new BufferedInputStream(fi, BUFFER);

                ZipEntry entry = new ZipEntry(_files[i].substring(_files[i].lastIndexOf("/") + 1));
                out.putNextEntry(entry);
                int count;

                while ((count = origin.read(data, 0, BUFFER)) != -1) {
                    out.write(data, 0, count);
                }
                origin.close();
            }

            out.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void unzip(String _zipFile, String _targetLocation) {

        //create target location folder if not exist
        dirChecker(_targetLocation);

        // Log.i("Zip Manager", _zipFile);
        try {
            FileInputStream fin = new FileInputStream(_zipFile);
            ZipInputStream zin = new ZipInputStream(fin);
            ZipEntry ze = null;
            while ((ze = zin.getNextEntry()) != null) {
                // Log.i("Zip Manager", _targetLocation + ze.getName());
                //create dir if required while unzipping
                if (ze.isDirectory()) {
                    dirChecker(_targetLocation + ze.getName());
                } else {

                    // Nothing to do with actual logic starts
                    // Checking due to Zip Path Traversal Vulnerability
                    try {
                        File f = new File(_targetLocation, ze.getName());
                        String canonicalPath = f.getCanonicalPath();
                        if (!canonicalPath.startsWith(_targetLocation)) {
                            throw new Exception(String.format("Found Zip Path Traversal Vulnerability with %s", canonicalPath));
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                        return;
                    }
                    // Nothing to do with actual logic ends

                    // Now Finishing Unzipping
                    FileOutputStream fout = new FileOutputStream(_targetLocation + ze.getName());
                    // BufferedInputStream in = new BufferedInputStream(zin);
                    BufferedOutputStream out = new BufferedOutputStream(fout);
                    byte b[] = new byte[1024];
                    int n;
                    while ((n = zin.read(b,0, 1024)) >= 0) {
                        out.write(b,0,n);
                    }
                    out.close();

                    /*FileOutputStream fout = new FileOutputStream(_targetLocation + ze.getName());
                    for (int c = zin.read(); c != -1; c = zin.read()) {
                        fout.write(c);
                    }*/
                    zin.closeEntry();
                    fout.close();

                    /*InputStream inputStream = new FileInputStream(_targetLocation + ze.getName());
                    BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
                    StringBuilder sout = new StringBuilder();
                    String line;
                    while ((line = reader.readLine()) != null) {
                        sout.append(line);
                    }
                    reader.close();
                    Log.i("Zip manager", sout.toString());*/

                }

            }
            zin.close();
            fin.close();
        } catch (Exception e) {
            System.out.println(e);
        }
    }

    private void dirChecker(String dir) {
        File f = new File(dir);
        if (!f.isDirectory()) {
            f.mkdirs();
        }
    }

}