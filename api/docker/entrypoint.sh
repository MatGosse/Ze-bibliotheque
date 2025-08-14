setfacl -R -m u:www-data:rwX -m u:"$(whoami)":rwX /var/www/html
setfacl -R -m u:www-data:rwX -m u:"$(whoami)":rwX var
setfacl -R -m o:--- var
setfacl -R -m u:www-data:rwX -m u:"$(whoami)":rwX var/cache var/log
setfacl -R -m o:--X var/cache var/log

apache2-foreground
