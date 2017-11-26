pkg.name := $(shell json -e 'this.q = this.name + "-" + this.version' q < src/manifest.json)
out := _build
src := $(shell find src -type f)

mkdir = @mkdir -p $(dir $@)

crx: $(out)/$(pkg.name).crx

$(out)/$(pkg.name).zip: $(src)
	$(mkdir)
	cd $(dir $<) && zip -qr $(CURDIR)/$@ *

%.crx: %.zip private.pem
	./zip2crx.sh $< private.pem

private.pem:
	openssl genrsa 2048 > $@
